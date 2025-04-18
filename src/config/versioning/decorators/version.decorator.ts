import { SetMetadata, applyDecorators, Version as NestVersion } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { 
  VERSION_METADATA_KEY, 
  VERSION_NEUTRAL_METADATA_KEY,
  VERSION_ERROR_MESSAGES,
  DEFAULT_VERSION_HEADER
} from '../constants/version.constants';

/**
 * Apply API version to a controller or route handler
 * This extends NestJS's built-in Version decorator with additional metadata
 * 
 * @param version - API version or versions to apply
 * @returns Decorator function
 */
export function ApiVersion(version: string | string[]) {
  return applyDecorators(
    NestVersion(version),
    SetMetadata(VERSION_METADATA_KEY, version),
    ApiHeader({
      name: DEFAULT_VERSION_HEADER,
      description: 'API version',
      required: false,
      schema: { 
        type: 'string',
        default: Array.isArray(version) ? version[0] : version
      }
    }),
  );
}

/**
 * Mark an endpoint as version neutral (accessible from any version)
 * 
 * @returns Decorator function
 */
export function ApiVersionNeutral() {
  return applyDecorators(
    SetMetadata(VERSION_NEUTRAL_METADATA_KEY, true),
  );
}

/**
 * Add deprecation notice for a specific API version
 * 
 * @param version - The version that is deprecated
 * @param message - Custom deprecation message
 * @returns Decorator function
 */
export function ApiVersionDeprecated(version: string, message?: string) {
  return applyDecorators(
    ApiResponse({
      status: 299,
      description: message || `API version ${version} is deprecated and will be removed soon`,
      headers: {
        'Deprecation': {
          description: 'Indicates this API version will be removed in a future release',
          schema: {
            type: 'string',
            example: 'version="1"',
          },
        },
        'Sunset': {
          description: 'Date after which this API version will be removed',
          schema: {
            type: 'string',
            example: 'Wed, 01 Jan 2025 00:00:00 GMT',
          },
        },
      },
    }),
  );
} 