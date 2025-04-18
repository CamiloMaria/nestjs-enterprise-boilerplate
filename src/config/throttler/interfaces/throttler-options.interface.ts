/**
 * Interface for throttler options
 */
export interface ThrottlerOptions {
  /**
   * Time to live in seconds
   * The amount of time a request counts towards the limit
   */
  ttl: number;

  /**
   * The maximum number of requests allowed within the TTL
   */
  limit: number;

  /**
   * Skip throttling if the request IP is not available
   */
  skipIfEmpty?: boolean;

  /**
   * Whether the throttler is enabled
   */
  enabled?: boolean;

  /**
   * Storage TTL in seconds (for Redis storage)
   */
  storageTtl?: number;
} 