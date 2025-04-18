import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

/**
 * Logger service that provides methods for logging at different levels.
 * Wraps the Pino logger for consistent usage across the application.
 */
@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService implements NestLoggerService {
  private currentContext: string = LoggerService.name;

  constructor(private readonly logger: PinoLogger) {
    // Set the logger context to the name of the class
    this.setContext(LoggerService.name);
  }

  /**
   * Log a message at the 'log' level (info in Pino)
   */
  log(message: string, context?: string): void {
    this.logger.info({ context: context || this.currentContext }, message);
  }

  /**
   * Log a message at the 'error' level
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error({ context: context || this.currentContext, trace }, message);
  }

  /**
   * Log a message at the 'warn' level
   */
  warn(message: string, context?: string): void {
    this.logger.warn({ context: context || this.currentContext }, message);
  }

  /**
   * Log a message at the 'debug' level
   */
  debug(message: string, context?: string): void {
    this.logger.debug({ context: context || this.currentContext }, message);
  }

  /**
   * Log a message at the 'verbose' level (debug in Pino)
   */
  verbose(message: string, context?: string): void {
    this.logger.debug({ context: context || this.currentContext, level: 'verbose' }, message);
  }

  /**
   * Set the context for subsequent log messages
   */
  setContext(context: string): void {
    this.currentContext = context;
    this.logger.setContext(context);
  }
} 