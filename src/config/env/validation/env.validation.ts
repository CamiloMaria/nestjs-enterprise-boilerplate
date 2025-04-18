import Joi from 'joi';
import { EnvConstants } from '../constants/env.constants';
import { EnvironmentVariables } from '../interfaces/env.interface';

/**
 * Validation schema for environment variables
 * This ensures required environment variables are present
 * and have the correct format at application startup
 */
export const envValidationSchema = Joi.object<EnvironmentVariables>({
  // API Documentation
  [EnvConstants.SWAGGER_TITLE]: Joi.string().required(),
  [EnvConstants.SWAGGER_DESCRIPTION]: Joi.string().required(),
  [EnvConstants.SWAGGER_VERSION]: Joi.string().required(),
  [EnvConstants.SWAGGER_DOCUMENT_SUFFIX]: Joi.string().required(),

  // Server
  [EnvConstants.NODE_ENV]: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  [EnvConstants.PORT]: Joi.number().default(3000),
  [EnvConstants.API_PREFIX]: Joi.string().default('api'),
  [EnvConstants.HOST]: Joi.string().default('localhost'),

  // JWT
  [EnvConstants.JWT_SECRET]: Joi.string().required(),
  [EnvConstants.JWT_EXPIRES_IN]: Joi.string().default('1d'),

  // Swagger
  [EnvConstants.SWAGGER_ENABLED]: Joi.boolean().default(true),

  // CORS
  [EnvConstants.CORS_ENABLED]: Joi.boolean().default(true),
  [EnvConstants.CORS_ORIGIN]: Joi.string().default('*'),

  // Throttler (Rate Limiting)
  [EnvConstants.THROTTLER_TTL]: Joi.number().default(60000), // Time-to-live in seconds
  [EnvConstants.THROTTLER_LIMIT]: Joi.number().default(10), // Max number of requests during TTL
  [EnvConstants.THROTTLER_ENABLED]: Joi.boolean().default(true), // Whether throttling is enabled
  [EnvConstants.THROTTLER_SKIP_IF_EMPTY]: Joi.boolean().default(false), // Skip throttling if no req IP
  [EnvConstants.THROTTLER_STORAGE_TTL]: Joi.number().default(3600), // Storage TTL in seconds (Redis)

  // API Versioning
  [EnvConstants.API_VERSION]: Joi.string().default('1'),
  [EnvConstants.API_SUPPORTED_VERSIONS]: Joi.string().default('1,2'),
  [EnvConstants.API_DEPRECATED_VERSIONS]: Joi.string().allow('').optional(),
  [EnvConstants.API_VERSIONING_TYPE]: Joi.string().default('uri'),
  [EnvConstants.API_VERSIONING_HEADER]: Joi.string().default('X-API-Version'),
  [EnvConstants.API_VERSIONING_ENABLED]: Joi.boolean().default(true),
}); 