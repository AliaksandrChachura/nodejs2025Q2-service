import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, query, body } = request;

    const startTime = Date.now();

    const hasQuery = query && Object.keys(query).length > 0;
    const hasBody = body && Object.keys(body).length > 0;

    let requestMessage = `Incoming Request: ${method} ${url}`;
    if (hasQuery) {
      requestMessage += ` | Query: ${JSON.stringify(query)}`;
    }
    if (hasBody) {
      const sanitizedBody = this.sanitizeBody(body);
      requestMessage += ` | Body: ${JSON.stringify(sanitizedBody)}`;
    }

    this.loggingService.verbose(requestMessage, 'LoggingInterceptor');

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const duration = Date.now() - startTime;

          this.loggingService.verbose(
            `Outgoing Response: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          const statusCode = response.statusCode || 500;
          const duration = Date.now() - startTime;

          this.loggingService.verbose(
            `Outgoing Response: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - Error: ${error.message || 'Unknown error'}`,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

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
