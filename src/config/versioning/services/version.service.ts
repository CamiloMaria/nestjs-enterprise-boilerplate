import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../../../config/env/env.service';
import { ApiVersions } from '../interfaces/version.interface';
import { DEFAULT_VERSION } from '../constants/version.constants';

/**
 * Service for managing API versions
 */
@Injectable()
export class VersionService {
  private readonly logger = new Logger(VersionService.name);
  private apiVersions: ApiVersions;

  constructor(private readonly envService: EnvService) {
    this.initializeVersions();
  }

  /**
   * Initialize API versions from environment configuration
   */
  private initializeVersions(): void {
    const current = this.envService.apiVersion || DEFAULT_VERSION;
    
    // Get supported versions from env or default to current version only
    const supportedVersions = this.envService.apiSupportedVersions 
      ? this.envService.apiSupportedVersions.split(',').map(v => v.trim()) 
      : [current];
    
    // Get deprecated versions from env or default to empty array
    const deprecatedVersions = this.envService.apiDeprecatedVersions 
      ? this.envService.apiDeprecatedVersions.split(',').map(v => v.trim()) 
      : [];

    this.apiVersions = {
      current,
      supported: supportedVersions,
      deprecated: deprecatedVersions,
    };

    this.logger.log(`API Versions initialized: Current=${current}, Supported=[${supportedVersions}], Deprecated=[${deprecatedVersions}]`);
  }

  /**
   * Get the current API versions configuration
   * @returns The API versions configuration
   */
  getApiVersions(): ApiVersions {
    return this.apiVersions;
  }

  /**
   * Check if a version is supported
   * @param version Version to check
   * @returns True if the version is supported
   */
  isVersionSupported(version: string): boolean {
    return this.apiVersions.supported.includes(version);
  }

  /**
   * Check if a version is deprecated
   * @param version Version to check
   * @returns True if the version is deprecated
   */
  isVersionDeprecated(version: string): boolean {
    return this.apiVersions.deprecated.includes(version);
  }

  /**
   * Get the current API version
   * @returns The current API version
   */
  getCurrentVersion(): string {
    return this.apiVersions.current;
  }
} 