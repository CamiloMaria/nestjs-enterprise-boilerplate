import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { LoggerModule } from './config/logger/logger.module';
import { EnvModule } from './config/env/env.module';
import { ThrottlerModule } from './config/throttler/throttler.module';
import { VersioningModule } from './config/versioning/versioning.module';

@Module({
  imports: [
    // Core modules
    EnvModule,
    LoggerModule,
    ThrottlerModule,
    VersioningModule,
    
    // Feature modules
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
