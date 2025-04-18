import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for health check responses
 */
export class HealthStatusDto {
  @ApiProperty({
    description: 'Status of the health check',
    enum: ['ok', 'error'],
    example: 'ok',
  })
  status: 'ok' | 'error';

  @ApiPropertyOptional({
    description: 'Additional details about the health check',
    example: {
      uptime: 123.45,
      timestamp: '2023-09-15T12:34:56Z',
    },
  })
  details?: Record<string, any>;
}

/**
 * DTO for liveness probe responses
 */
export class LivenessStatusDto extends HealthStatusDto {
  @ApiPropertyOptional({
    description: 'Additional details specific to liveness',
    example: {
      uptime: 123.45,
      timestamp: '2023-09-15T12:34:56Z',
    },
  })
  details?: {
    uptime: number;
    timestamp: string;
  };
}

/**
 * DTO for readiness probe responses
 */
export class ReadinessStatusDto extends HealthStatusDto {
  @ApiPropertyOptional({
    description: 'Additional details specific to readiness',
    example: {
      ready: true,
      memoryUsage: {
        rss: 45887488,
        heapTotal: 23068672,
        heapUsed: 13135856,
        external: 1829969,
        arrayBuffers: 215057,
      },
    },
  })
  details?: {
    ready: boolean;
    memoryUsage: Record<string, number>;
  };
}