import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard error response format
 */
export class ApiErrorDto {
  @ApiProperty({
    description: 'Error code for programmatic handling',
    example: 'VALIDATION_ERROR',
  })
  code: string;

  @ApiPropertyOptional({
    description: 'Additional error information if available',
    example: 'The provided email or password is incorrect',
  })
  details?: any;
}

/**
 * Pagination metadata
 */
export class ApiPaginationDto {
  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total items available',
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}

/**
 * Metadata for API responses
 */
export class ApiMetaDto {
  @ApiProperty({
    description: 'ISO timestamp of when the response was generated',
    example: '2023-05-20T15:30:45Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'The API endpoint path',
    example: '/tickets/me',
  })
  path: string;

  @ApiPropertyOptional({
    description: 'Pagination information',
    type: ApiPaginationDto,
    nullable: true,
  })
  pagination?: ApiPaginationDto | null;
}

/**
 * Standard API response format
 * @template T Type of the data payload
 * 
 * Note: This response will contain either:
 * - A 'data' field (for successful responses, when success=true)
 * - An 'error' field (for error responses, when success=false)
 * 
 * These fields are mutually exclusive and will never appear together in the same response.
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message about the result',
    example: 'Tickets retrieved successfully',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'The actual payload (only present for successful responses)',
    nullable: true,
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Details about errors (only present for unsuccessful responses)',
    type: ApiErrorDto,
    nullable: true,
  })
  error?: ApiErrorDto;

  @ApiProperty({
    description: 'Additional information about the response',
    type: ApiMetaDto,
  })
  meta: ApiMetaDto;
} 