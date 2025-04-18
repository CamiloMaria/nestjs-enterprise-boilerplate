import { Module, Global } from '@nestjs/common';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EnvService } from '../env/env.service';
import { ThrottlerGuard } from './guards/throttler.guard';

/**
 * Throttler module for rate limiting
 * Provides rate limiting capabilities for the application
 * using the NestJS throttler module
 */
@Global()
@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        throttlers: [
          {
            ttl: envService.throttlerTtl,
            limit: envService.throttlerLimit,
          },
        ],
        skipIf: () => !envService.throttlerEnabled,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [NestThrottlerModule],
})
export class ThrottlerModule {} 