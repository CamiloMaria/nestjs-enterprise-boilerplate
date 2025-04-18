/**
 * Interface for typed access to environment variables
 */
export interface EnvironmentVariables {
  // API Documentation
  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_VERSION: string;
  SWAGGER_DOCUMENT_SUFFIX: string;

  // Server
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  API_PREFIX: string;
  HOST: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Swagger
  SWAGGER_ENABLED?: boolean;

  // Cors
  CORS_ENABLED?: boolean;
  CORS_ORIGIN?: string;

  // Throttler (Rate Limiting)
  THROTTLER_TTL?: number;
  THROTTLER_LIMIT?: number;
  THROTTLER_ENABLED?: boolean;
  THROTTLER_SKIP_IF_EMPTY?: boolean;
  THROTTLER_STORAGE_TTL?: number;

  // API Versioning
  API_VERSION: string;
  API_SUPPORTED_VERSIONS: string;
  API_DEPRECATED_VERSIONS: string;
  API_VERSIONING_TYPE: string;
  API_VERSIONING_HEADER: string;
  API_VERSIONING_ENABLED: boolean;
} 