import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { LoggingService } from '../logging/logging.service';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
}

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.getErrorResponse(exception, request);
    const status = errorResponse.statusCode;

    this.logError(exception, request, status);

    response.status(status).json(errorResponse);
  }

  private getErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as { message?: string | string[]; error?: string };
        message = responseObj.message || exception.message;
        error = responseObj.error;
      } else {
        message = exception.message;
      }

      if (
        status === HttpStatus.BAD_REQUEST &&
        Array.isArray(message) &&
        message.length > 0
      ) {
        error = 'Validation Error';
      }
    } else if (exception instanceof Error) {
      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        status = this.handlePrismaError(exception);
        message = this.getPrismaErrorMessage(exception);
        error = 'Database Error';
      } else if (exception instanceof Prisma.PrismaClientValidationError) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid database query';
        error = 'Validation Error';
      } else {
        message = exception.message || 'Internal server error';
        error = exception.name || 'Error';
      }
    }

    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };
  }

  private handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
  ): HttpStatus {
    switch (error.code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      case 'P2003':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getPrismaErrorMessage(
    error: Prisma.PrismaClientKnownRequestError,
  ): string {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target;
        if (Array.isArray(target) && target.length > 0) {
          return `${target.join(', ')} already exists`;
        }
        return 'A record with this value already exists';
      }
      case 'P2025':
        return (typeof error.meta?.cause === 'string' ? error.meta.cause : undefined) || 'Record not found';
      case 'P2003':
        return 'Invalid reference to related record';
      default:
        return error.message || 'Database operation failed';
    }
  }

  private logError(
    exception: unknown,
    request: Request,
    status: number,
  ): void {
    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || request.connection.remoteAddress;

    let errorMessage = 'Unknown error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (typeof exceptionResponse === 'object' && exceptionResponse !== null
              ? (exceptionResponse as { message?: string }).message
              : undefined) || exception.message;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      stack = exception.stack;
    }

    const logContext = 'HttpExceptionFilter';
    const logMessage = `${method} ${url} - ${status} - ${errorMessage}`;
    const logDetails = {
      method,
      url,
      status,
      ip,
      userAgent,
      body: this.sanitizeBody(body),
      query,
      params,
      stack,
    };

    if (status >= 500) {
      this.loggingService.error(
        `${logMessage}\nDetails: ${JSON.stringify(logDetails, null, 2)}`,
        logContext,
      );
    } else if (status >= 400) {
      this.loggingService.warn(
        `${logMessage}\nDetails: ${JSON.stringify(logDetails, null, 2)}`,
        logContext,
      );
    } else {
      this.loggingService.debug(
        `${logMessage}\nDetails: ${JSON.stringify(logDetails, null, 2)}`,
        logContext,
      );
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'oldPassword', 'newPassword', 'token'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  }
}
