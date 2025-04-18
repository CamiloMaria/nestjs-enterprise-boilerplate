import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';
import { THROTTLER_CUSTOM_CONFIG } from '../decorators/throttle.decorator';

/**
 * Custom throttler guard that respects the custom throttle decorator
 * Allows for per-route throttling configuration
 */
@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  constructor(
    protected readonly options: ThrottlerModuleOptions,
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  /**
   * Check if the request should be throttled
   * @param context The execution context
   * @returns Whether to skip throttling for this request
   */
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // Get the handler and class
    const handler = context.getHandler();
    const classRef = context.getClass();
    
    // Check for custom throttle metadata
    const customConfig = this.reflector.get(
      THROTTLER_CUSTOM_CONFIG,
      handler,
    ) || this.reflector.get(THROTTLER_CUSTOM_CONFIG, classRef);

    // Skip if explicitly set
    if (customConfig?.skip) {
      return true;
    }

    // Otherwise use the default behavior
    return super.shouldSkip(context);
  }
} 