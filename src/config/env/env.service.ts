import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConstants } from './constants/env.constants';

/**
 * Service for type-safe access to environment variables
 */
@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get a typed environment variable
   * @param key The environment variable key
   */
  get<T>(key: EnvConstants): T {
    return this.configService.get<T>(key);
  }

  /**
   * Get a typed environment variable or return a default value if not set
   * @param key The environment variable key
   * @param defaultValue Default value to return if the key is not set
   */
  getOrDefault<T>(key: EnvConstants, defaultValue: T): T {
    const value = this.configService.get<T>(key);
    return value !== undefined ? value : defaultValue;
  }

  // API Documentation
  get swaggerTitle(): string {
    return this.get<string>(EnvConstants.SWAGGER_TITLE);
  }

  get swaggerDescription(): string {
    return this.get<string>(EnvConstants.SWAGGER_DESCRIPTION);
  }

  get swaggerVersion(): string {
    return this.get<string>(EnvConstants.SWAGGER_VERSION);
  }

  get swaggerDocumentSuffix(): string {
    return this.get<string>(EnvConstants.SWAGGER_DOCUMENT_SUFFIX);
  }

  // Server
  get nodeEnv(): string {
    return this.get<string>(EnvConstants.NODE_ENV);
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get port(): number {
    return this.get<number>(EnvConstants.PORT);
  }

  get apiPrefix(): string {
    return this.get<string>(EnvConstants.API_PREFIX);
  }

  get host(): string {
    return this.get<string>(EnvConstants.HOST);
  }

  // JWT
  get jwtSecret(): string {
    return this.get<string>(EnvConstants.JWT_SECRET);
  }

  get jwtExpiresIn(): string {
    return this.get<string>(EnvConstants.JWT_EXPIRES_IN);
  }

  // Swagger
  get swaggerEnabled(): boolean {
    return this.getOrDefault<boolean>(EnvConstants.SWAGGER_ENABLED, true);
  }

  // CORS
  get corsEnabled(): boolean {
    return this.getOrDefault<boolean>(EnvConstants.CORS_ENABLED, true);
  }

  get corsOrigin(): string {
    return this.getOrDefault<string>(EnvConstants.CORS_ORIGIN, '*');
  }

  // Throttler (Rate Limiting)
  get throttlerTtl(): number {
    return this.getOrDefault<number>(EnvConstants.THROTTLER_TTL, 60000);
  }

  get throttlerLimit(): number {
    return this.getOrDefault<number>(EnvConstants.THROTTLER_LIMIT, 10);
  }

  get throttlerEnabled(): boolean {
    return this.getOrDefault<boolean>(EnvConstants.THROTTLER_ENABLED, true);
  }

  get throttlerSkipIfEmpty(): boolean {
    return this.getOrDefault<boolean>(EnvConstants.THROTTLER_SKIP_IF_EMPTY, false);
  }

  get throttlerStorageTtl(): number {
    return this.getOrDefault<number>(EnvConstants.THROTTLER_STORAGE_TTL, 3600);
  }

  // API Versioning
  get apiVersion(): string {
    return this.getOrDefault<string>(EnvConstants.API_VERSION, '1');
  }

  get apiSupportedVersions(): string {
    return this.getOrDefault<string>(EnvConstants.API_SUPPORTED_VERSIONS, this.apiVersion);
  }

  get apiDeprecatedVersions(): string {
    return this.getOrDefault<string>(EnvConstants.API_DEPRECATED_VERSIONS, '');
  }

  get apiVersioningType(): string {
    return this.getOrDefault<string>(EnvConstants.API_VERSIONING_TYPE, 'uri');
  }

  get apiVersioningHeader(): string {
    return this.getOrDefault<string>(EnvConstants.API_VERSIONING_HEADER, 'X-API-Version');
  }

  get apiVersioningEnabled(): boolean {
    return this.getOrDefault<boolean>(EnvConstants.API_VERSIONING_ENABLED, true);
  }
} 