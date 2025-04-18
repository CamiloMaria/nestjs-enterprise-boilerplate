import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  Logger,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VersionService } from '../services/version.service';
import { EnvService } from '../../../config/env/env.service';
import { 
  VERSION_METADATA_KEY, 
  VERSION_NEUTRAL_METADATA_KEY,
  VERSION_ERROR_MESSAGES,
  DEFAULT_VERSION_HEADER
} from '../constants/version.constants';

/**
 * Guard to validate API versions
 * Checks if the requested version is supported and warns about deprecated versions
 */
@Injectable()
export class VersionGuard implements CanActivate {
  private readonly logger = new Logger(VersionGuard.name);
  private readonly headerName: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly versionService: VersionService,
    private readonly envService: EnvService,
  ) {
    // Get the configured header name or use the default
    this.headerName = this.envService.apiVersioningHeader.toLowerCase();
  }

  /**
   * Check if the request can activate the route based on version requirements
   * 
   * @param context Execution context
   * @returns Boolean indicating if the route can be accessed
   */
  canActivate(context: ExecutionContext): boolean {
    // Check if the endpoint is version neutral (no version required)
    const isVersionNeutral = this.reflector.getAllAndOverride<boolean>(
      VERSION_NEUTRAL_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isVersionNeutral) {
      return true;
    }

    // Get required versions for the route
    const requiredVersions = this.reflector.getAllAndOverride<string | string[]>(
      VERSION_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no version requirements, allow access
    if (!requiredVersions) {
      return true;
    }

    // Get the request and extract version from it
    const req = context.switchToHttp().getRequest();
    const version = req.params?.version // URI versioning
      || req.headers?.[this.headerName] // Header versioning
      || this.extractMediaTypeVersion(req.headers?.['accept']); // Media type versioning

    // If no version provided and required, block access
    if (!version && requiredVersions) {
      throw new HttpException(
        VERSION_ERROR_MESSAGES.MISSING_VERSION,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the version is supported
    if (!this.versionService.isVersionSupported(version)) {
      throw new HttpException(
        VERSION_ERROR_MESSAGES.UNSUPPORTED_VERSION,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the version is deprecated and warn
    if (this.versionService.isVersionDeprecated(version)) {
      // Add deprecation headers for HTTP response
      const response = context.switchToHttp().getResponse();
      response.header('Deprecation', `version="${version}"`);
      
      // Log warning about deprecated version
      this.logger.warn(`Deprecated API version ${version} used, path: ${req.path}`);
    }

    // If we've made it this far, allow access
    return true;
  }

  /**
   * Extract version from the Accept header for media type versioning
   * 
   * @param acceptHeader The Accept header value
   * @returns The version if present, undefined otherwise
   */
  private extractMediaTypeVersion(acceptHeader: string): string | undefined {
    if (!acceptHeader) {
      return undefined;
    }

    // Look for version=X in the Accept header
    const versionMatch = acceptHeader.match(/version=([0-9]+)/i);
    if (versionMatch && versionMatch[1]) {
      return versionMatch[1];
    }

    return undefined;
  }
} 