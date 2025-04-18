import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { VersionService } from './services/version.service';
import { VersionGuard } from './guards/version.guard';

/**
 * Versioning module for API version management
 * 
 * This module provides:
 * - Version validation guard
 * - Version service for checking supported versions
 * - Version decorators for applying version constraints
 */
@Global()
@Module({
  providers: [
    VersionService,
    {
      provide: APP_GUARD,
      useClass: VersionGuard,
    },
  ],
  exports: [VersionService],
})
export class VersioningModule {} 