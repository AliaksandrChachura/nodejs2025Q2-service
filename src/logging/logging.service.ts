import { Injectable } from '@nestjs/common';
import { appendFileSync, existsSync, statSync, renameSync, mkdirSync } from 'fs';
import { dirname } from 'path';

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

  private readonly colors = {
    error: '\x1b[31m', // Red
    warn: '\x1b[33m', // Yellow
    log: '\x1b[36m', // Cyan
    verbose: '\x1b[35m', // Magenta
    debug: '\x1b[34m', // Blue
    silly: '\x1b[90m', // Gray
    reset: '\x1b[0m',
  };

  constructor() {
    const envLevel = (process.env.LOG_LEVEL || 'log') as LogLevel;

    if (!this.isValidLogLevel(envLevel)) {
      throw new Error(`Invalid log level: ${envLevel}`);
    }

    this.currentLevel = envLevel;
    this.logFilePath = process.env.LOG_FILE_PATH;
    this.maxSizeBytes = process.env.LOG_MAX_SIZE_KB
      ? parseInt(process.env.LOG_MAX_SIZE_KB) * 1024
      : undefined;

    if (this.logFilePath) {
      const logDir = dirname(this.logFilePath);
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
    }
  }

  private isValidLogLevel(level: string): boolean {
    return Object.keys(this.levelOrder).includes(level);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelOrder[level] <= this.levelOrder[this.currentLevel];
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level.toUpperCase().padEnd(7)} ${contextStr} ${message}`;
  }

  private writeToFile(message: string): void {
    if (!this.logFilePath) {
      return;
    }

    try {
      if (this.maxSizeBytes && existsSync(this.logFilePath)) {
        const stats = statSync(this.logFilePath);
        if (stats.size >= this.maxSizeBytes) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const rotatedPath = `${this.logFilePath}.${timestamp}`;
          renameSync(this.logFilePath, rotatedPath);
        }
      }

      appendFileSync(this.logFilePath, message + '\n', 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private getConsoleMethod(level: LogLevel): keyof Console {
    const consoleMethodMap: Record<LogLevel, keyof Console> = {
      error: 'error',
      warn: 'warn',
      log: 'log',
      verbose: 'log',
      debug: 'debug',
      silly: 'log',
    };
    return consoleMethodMap[level];
  }

  private logMessage(level: LogLevel, message: string, context?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, context);

    const color = this.colors[level];
    const reset = this.colors.reset;
    const consoleMethod = this.getConsoleMethod(level);
    
    // Use console.log as fallback if method doesn't exist (e.g., debug in some environments)
    const method = console[consoleMethod] || console.log;
    method.call(console, `${color}${formattedMessage}${reset}`);

    this.writeToFile(formattedMessage);
  }

  error(message: string, context?: string): void {
    this.logMessage('error', message, context);
  }

  warn(message: string, context?: string): void {
    this.logMessage('warn', message, context);
  }

  log(message: string, context?: string): void {
    this.logMessage('log', message, context);
  }

  verbose(message: string, context?: string): void {
    this.logMessage('verbose', message, context);
  }

  debug(message: string, context?: string): void {
    this.logMessage('debug', message, context);
  }

  silly(message: string, context?: string): void {
    this.logMessage('silly', message, context);
  }
}