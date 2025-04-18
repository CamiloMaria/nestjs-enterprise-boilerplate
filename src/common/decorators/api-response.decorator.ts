import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto, ApiErrorDto } from '../dtos/api-response.dto';

/**
 * Custom decorator for Swagger to document standard API success responses
 * 
 * @param dataDto Data DTO type to be wrapped in ApiResponseDto
 * @param status HTTP status code
 * @param description Response description
 */
export const ApiStandardResponse = <TModel extends Type<any>>(
  dataDto: TModel,
  status = 200,
  description?: string
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiResponse({
      status,
      description: description || 'Successful operation',
      schema: {
        allOf: [
          {
            properties: {
              success: { 
                type: 'boolean', 
                example: true 
              },
              data: {
                $ref: getSchemaPath(dataDto),
              },
              meta: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string', example: new Date().toISOString() },
                  statusCode: { type: 'number', example: status },
                  path: { type: 'string', example: '/api/v1/endpoint' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

/**
 * Custom decorator for Swagger to document standard API success responses with arrays
 * 
 * @param dataDto Data DTO type to be wrapped in ApiResponseDto as array
 * @param status HTTP status code
 * @param description Response description
 */
export const ApiStandardArrayResponse = <TModel extends Type<any>>(
  dataDto: TModel,
  status = 200,
  description?: string
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiResponse({
      status,
      description: description || 'Successful operation',
      schema: {
        allOf: [
          {
            properties: {
              success: { 
                type: 'boolean', 
                example: true 
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
              meta: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string' },
                  statusCode: { type: 'number' },
                  path: { type: 'string' },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'number' },
                      limit: { type: 'number' },
                      total: { type: 'number' },
                      totalPages: { type: 'number' },
                    },
                  },  
                },
              },
            },
          },
        ],
      },
    }),
  );
};

/**
 * Custom decorator for Swagger to document standard API error responses
 * 
 * @param errorCodes Array of possible error codes
 * @param status HTTP status code
 * @param description Response description
 */
export const ApiErrorResponse = (
  errorCodes: string[],
  status = 400,
  description?: string
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ApiErrorDto),
    ApiResponse({
      status,
      description: description || 'Error response',
      schema: {
        allOf: [
          {
            properties: {
              success: { 
                type: 'boolean', 
                example: false 
              },
              error: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    enum: errorCodes,
                    example: errorCodes[0],
                  },
                  details: {
                    type: 'string',
                    example: 'Error details message'
                  }
                }
              },
              meta: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string', example: new Date().toISOString() },
                  statusCode: { type: 'number', example: status },
                  path: { type: 'string', example: '/api/v1/endpoint' },
                },
              },
            },
          },
        ],
      },
    }),
  );
}; 