import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { EnvService } from '../env/env.service';
import { ApiResponseDto } from '../../common/dtos/api-response.dto';

/**
 * Sets up Swagger documentation for the application
 * 
 * @param app - The NestJS application instance
 * @param logger - The logger service instance
 * @param envService - The environment service instance
 */
export const setupSwagger = (app: INestApplication, logger: LoggerService, envService: EnvService) => {
  const config = new DocumentBuilder()
    .setTitle(envService.swaggerTitle)
    .setDescription(getSwaggerDescription(envService))
    .setVersion(envService.swaggerVersion)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    );
  
  // Add version header as global parameter if header-based versioning is enabled
  if (envService.apiVersioningEnabled && 
      envService.apiVersioningType.toLowerCase() === 'header') {
    config.addGlobalParameters({
      name: envService.apiVersioningHeader,
      in: 'header',
      description: 'API version',
      required: false,
      schema: {
        type: 'string',
        default: envService.apiVersion
      }
    });
  }

  const builtConfig = config.build();
  const document = SwaggerModule.createDocument(app, builtConfig, {
    extraModels: [ApiResponseDto],
  });
  
  const swaggerDocumentSuffix = envService.swaggerDocumentSuffix;
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: envService.swaggerTitle,
  });

  logger.log(
    `Swagger documentation is available at http://${envService.host}:${envService.port}/${envService.apiPrefix}/${swaggerDocumentSuffix}`,
    'Swagger',
  );
};

/**
 * Generates a description for Swagger that includes API versioning information
 * 
 * @param envService - The environment service instance
 * @returns A formatted string describing the API, including versioning info
 */
function getSwaggerDescription(envService: EnvService): string {
  const baseDescription = envService.swaggerDescription;
  
  // If versioning is not enabled, return the base description
  if (!envService.apiVersioningEnabled) {
    return baseDescription;
  }
  
  // Add versioning information to the description
  const versioningInfo = `
  
    ## API Versioning

    This API uses ${envService.apiVersioningType} versioning.

    - **Current Version:** ${envService.apiVersion}
    - **Supported Versions:** ${envService.apiSupportedVersions || envService.apiVersion}
    ${envService.apiDeprecatedVersions ? `- **Deprecated Versions:** ${envService.apiDeprecatedVersions}` : ''}

    ${getVersioningUsageInstructions(envService)}
    `;

  return `${baseDescription}${versioningInfo}`;
}

/**
 * Generates instructions for using the versioning in the API
 * 
 * @param envService - The environment service instance
 * @returns A formatted string with usage instructions for API versioning
 */
function getVersioningUsageInstructions(envService: EnvService): string {
  const versioningType = envService.apiVersioningType.toLowerCase();
  
  switch(versioningType) {
    case 'uri':
      return `**Usage:** Include the version in the URL path, e.g., \`/${envService.apiPrefix}/v1/users\``;
    
    case 'header':
      return `**Usage:** Include the version in the \`${envService.apiVersioningHeader}\` header, e.g., \`${envService.apiVersioningHeader}: 1\``;
    
    case 'media-type':
      return `**Usage:** Include the version in the Accept header, e.g., \`Accept: application/json;version=1\``;
    
    default:
      return '';
  }
} 