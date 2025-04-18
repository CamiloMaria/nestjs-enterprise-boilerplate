import { Module, Global } from '@nestjs/common';
import { LoggerConfig } from './logger.config';
import { LoggerService } from './logger.service';

/**
 * Global logger module that provides the logger service
 * across the entire application.
 */
@Global()
@Module({
  imports: [LoggerConfig],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {} 