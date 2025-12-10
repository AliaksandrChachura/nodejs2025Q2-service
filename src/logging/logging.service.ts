import { Injectable } from '@nestjs/common';

export type LogLevel = 'error' | 'warn' | 'log' | 'verbose' | 'debug' | 'silly';

@Injectable()
export class LoggingService {
  private readonly levelOrder: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    log: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
  };

private readonly currentLevel: LogLevel;

private readonly logFilePath?: string;

private readonly maxSizeBytes?: number;

constructor() {
    const envLevel = (process.env.LOG_LEVEL || 'log') as LogLevel;
}

}