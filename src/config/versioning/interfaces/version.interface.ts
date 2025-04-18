/**
 * Version options for the API
 */
export interface VersionOptions {
  /**
   * Default version for endpoints without a specific version
   * If set to null, endpoints without a version will not be accessible
   */
  defaultVersion: string | null;

  /**
   * The type of versioning to use
   */
  type: VersionType;

  /**
   * Additional configuration based on versioning type
   */
  config?: VersionConfig;
}

/**
 * Version type enumeration
 */
export enum VersionType {
  /**
   * Versioning via URI path (e.g., /v1/users)
   */
  URI = 'uri',

  /**
   * Versioning via request header (e.g., X-API-Version: 1)
   */
  HEADER = 'header',

  /**
   * Versioning via media type (e.g., Accept: application/json;version=1)
   */
  MEDIA_TYPE = 'media-type',
}

/**
 * Configuration options for versioning
 */
export interface VersionConfig {
  /**
   * For header versioning, the header name
   * Default: 'X-API-Version'
   */
  headerName?: string;

  /**
   * For media type versioning, the key in the Accept header
   * Default: 'version='
   */
  mediaTypeKey?: string;
}

/**
 * Supported versions of the API
 */
export interface ApiVersions {
  /**
   * Current version of the API
   */
  current: string;

  /**
   * Supported versions of the API
   */
  supported: string[];

  /**
   * Deprecated versions of the API
   */
  deprecated: string[];
} 