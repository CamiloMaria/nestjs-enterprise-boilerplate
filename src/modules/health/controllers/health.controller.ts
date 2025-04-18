import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';
import { HealthStatus } from '../interfaces/health-indicator.interface';
import { 
  HealthStatusDto, 
  LivenessStatusDto, 
  ReadinessStatusDto, 
} from '../dtos/health-status.dto';
import { ApiStandardResponse, ApiStandardArrayResponse, ApiErrorResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiStandardResponse(HealthStatusDto, 200, 'Application is running')
  @ApiErrorResponse(['SERVICE_UNAVAILABLE'], 503, 'Application health check failed')
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.getStatus();
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiStandardResponse(LivenessStatusDto, 200, 'Application is alive')
  @ApiErrorResponse(['SERVICE_UNAVAILABLE'], 503, 'Application liveness check failed')
  async getLiveness(): Promise<HealthStatus> {
    return this.healthService.getLiveness();
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiStandardResponse(ReadinessStatusDto, 200, 'Application is ready to receive traffic')
  @ApiErrorResponse(['SERVICE_UNAVAILABLE'], 503, 'Application readiness check failed')
  async getReadiness(): Promise<HealthStatus> {
    return this.healthService.getReadiness();
  }

  @Get('all')
  @ApiOperation({ summary: 'All health indicators' })
  @ApiStandardArrayResponse(HealthStatusDto, 200, 'All health indicators')
  @ApiErrorResponse(['SERVICE_UNAVAILABLE'], 503, 'Failed to retrieve health indicators')
  async getAllHealth(): Promise<HealthStatus[]> {
    const basicHealth = await this.healthService.getStatus();
    const liveness = await this.healthService.getLiveness();
    const readiness = await this.healthService.getReadiness();
    
    return [basicHealth, liveness, readiness];
  }
}