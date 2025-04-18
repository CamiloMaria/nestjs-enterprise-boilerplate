import { Injectable } from '@nestjs/common';
import { HealthStatus } from '../interfaces/health-indicator.interface';
import { LoggerService } from '../../../config/logger/logger.service';

@Injectable()
export class HealthService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(HealthService.name);
  }

  /**
   * Basic health check that always returns OK
   * Used for general application status
   */
  async getStatus(): Promise<HealthStatus> {
    this.logger.log('Basic health check called');
    return {
      status: 'ok',
    };
  }

  /**
   * Liveness probe - indicates if the application is running
   * Used by container orchestrators like Kubernetes to determine if the pod is alive
   */
  async getLiveness(): Promise<HealthStatus> {
    this.logger.log('Liveness probe called');
    return {
      status: 'ok',
      details: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Readiness probe - indicates if the application is ready to receive traffic
   * Used by container orchestrators to determine if the pod should receive traffic
   */
  async getReadiness(): Promise<HealthStatus> {
    this.logger.log('Readiness probe called');
    return {
      status: 'ok',
      details: {
        ready: true,
        memoryUsage: process.memoryUsage(),
      },
    };
  }
}
