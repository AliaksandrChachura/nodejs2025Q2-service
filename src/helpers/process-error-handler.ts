import { LoggingService } from '../logging/logging.service';

let loggingService: LoggingService | null = null;

function fallbackLogError(message: string, error: Error | unknown): void {
  const timestamp = new Date().toISOString();
  const errorDetails =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : { error: String(error) };

  console.error(
    `[${timestamp}] [ERROR] [ProcessHandler] ${message}`,
    '\nError Details:',
    JSON.stringify(errorDetails, null, 2),
  );
}

function handleUncaughtException(error: Error): void {
  const message = 'Uncaught Exception - Application will exit';

  if (loggingService) {
    loggingService.error(
      `${message}\nError: ${error.name}: ${error.message}\nStack: ${error.stack || 'No stack trace available'}`,
      'UncaughtException',
    );
  } else {
    fallbackLogError(message, error);
  }

  setTimeout(() => {
    process.exit(1);
  }, 1000);
}

function handleUnhandledRejection(
  reason: unknown,
  promise: Promise<unknown>,
): void {
  const message = 'Unhandled Promise Rejection - Application will exit';
  const error =
    reason instanceof Error ? reason : new Error(String(reason));

  if (loggingService) {
    loggingService.error(
      `${message}\nError: ${error.name}: ${error.message}\nStack: ${error.stack || 'No stack trace available'}\nPromise: ${String(promise)}`,
      'UnhandledRejection',
    );
  } else {
    fallbackLogError(message, { reason, promise: String(promise) });
  }

  setTimeout(() => {
    process.exit(1);
  }, 1000);
}

export function initializeProcessErrorHandlers(): void {
  process.on('uncaughtException', handleUncaughtException);
  process.on('unhandledRejection', handleUnhandledRejection);
}

export function setProcessErrorHandlerLoggingService(
  service: LoggingService,
): void {
  loggingService = service;
}
