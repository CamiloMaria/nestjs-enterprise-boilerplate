/**
 * Versioning-related constants for the application
 */

/**
 * Default version if not specified in configuration
 */
export const DEFAULT_VERSION = '1';

/**
 * Version neutral identifier for routes that don't require versioning
 */
export const VERSION_NEUTRAL = 'neutral';

/**
 * Default header name for header-based versioning
 */
export const DEFAULT_VERSION_HEADER = 'X-API-Version';

/**
 * Default key for media type versioning in Accept header
 */
export const DEFAULT_MEDIA_TYPE_KEY = 'version=';

/**
 * Metadata key for custom version requirements
 */
export const VERSION_METADATA_KEY = 'API_VERSION';

/**
 * Metadata key for version neutral flag
 */
export const VERSION_NEUTRAL_METADATA_KEY = 'API_VERSION_NEUTRAL';

/**
 * Error messages for versioning
 */
export const VERSION_ERROR_MESSAGES = {
  UNSUPPORTED_VERSION: 'Unsupported API version',
  DEPRECATED_VERSION: 'This API version is deprecated and will be removed soon',
  MISSING_VERSION: 'API version is required but was not provided',
}; 