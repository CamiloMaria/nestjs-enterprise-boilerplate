import { SetMetadata } from '@nestjs/common';
import { Throttle as NestThrottle } from '@nestjs/throttler';

/**
 * Metadata key for custom throttle configuration
 */
export const THROTTLER_CUSTOM_CONFIG = 'throttler:customConfig';

/**
 * Decorator for disabling throttling on a route or controller
 */
export const SkipThrottle = () => SetMetadata(THROTTLER_CUSTOM_CONFIG, { skip: true });

/**
 * Decorator for applying specific throttling limits on a route or controller
 * @param limit Maximum number of requests within the TTL
 * @param ttl Time-to-live in seconds
 */
export function Throttle(limit: number, ttl: number) {
  return NestThrottle({ default: { limit, ttl } });
}