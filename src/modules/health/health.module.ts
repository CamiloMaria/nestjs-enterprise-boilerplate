import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';

/**
 * Health Module
 *
 * Provides endpoints to check the health of the application and its dependencies.
 * This includes basic health, liveness, readiness, and database connectivity.
 */
@Module({
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
 