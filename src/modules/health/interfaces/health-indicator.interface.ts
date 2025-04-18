/**
 * Interface for health indicators that can be used to check the health of various
 * components of the application.
 */
export interface IHealthIndicator {
  /**
   * Performs a health check and returns a status object
   * @returns Promise resolving to a status object with at least a status field
   */
  check(): Promise<HealthStatus>;
}

/**
 * Standard response format for health checks
 */
export interface HealthStatus {
  status: 'ok' | 'error';
  details?: Record<string, any>;
}
 