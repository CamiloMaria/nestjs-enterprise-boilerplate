import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger.config';
import { LoggerService } from './config/logger/logger.service';
import { EnvService } from './config/env/env.service';
import { ApiResponseInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';
import { VersioningType, VersioningOptions } from '@nestjs/common';
import { LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  // Create the NestJS application with Pino logger
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until logger is set up
  });

  // Get services
  const logger = await app.resolve(LoggerService);
  const envService = app.get(EnvService);

  // Use Pino logger from nestjs-pino
  app.useLogger(logger);

  // Apply global interceptors and exception filter
  app.useGlobalInterceptors(
    new ApiResponseInterceptor(),
    new LoggerErrorInterceptor(), // Add LoggerErrorInterceptor for improved error logging
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global prefix for all routes
  const globalPrefix = envService.apiPrefix;
  app.setGlobalPrefix(globalPrefix, {
    exclude: ['/'], // Exclude the root path if needed
  });

  // Enable API versioning if configured
  if (envService.apiVersioningEnabled) {
    const versioningType = envService.apiVersioningType.toLowerCase();
    let versioningOptions: VersioningOptions;

    // Configure versioning based on the selected type
    switch (versioningType) {
      case 'uri':
        versioningOptions = {
          type: VersioningType.URI,
          defaultVersion: envService.apiVersion,
        };
        break;
      case 'header':
        versioningOptions = {
          type: VersioningType.HEADER,
          header: envService.apiVersioningHeader,
          defaultVersion: envService.apiVersion,
        };
        break;
      case 'media-type':
        versioningOptions = {
          type: VersioningType.MEDIA_TYPE,
          key: 'version=',
          defaultVersion: envService.apiVersion,
        };
        break;
      default:
        // Default to URI versioning
        versioningOptions = {
          type: VersioningType.URI,
          defaultVersion: envService.apiVersion,
        };
    }

    // Enable versioning with the determined options
    app.enableVersioning(versioningOptions);
    logger.log(
      `API versioning enabled (type: ${versioningType}, default: ${envService.apiVersion})`,
      'Bootstrap',
    );
  }

  // Setup CORS if enabled
  if (envService.corsEnabled) {
    app.enableCors({
      origin: envService.corsOrigin,
      credentials: true,
    });
  }

  // Setup Swagger documentation if enabled
  if (envService.swaggerEnabled) {
    setupSwagger(app, logger, envService);
  }

  // Start the application
  const port = envService.port;
  const host = envService.host;

  await app.listen(port, host);
  logger.log(
    `Application is running on: http://${host}:${port}/${globalPrefix}`,
    'Bootstrap',
  );
}
bootstrap();
