import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler,
  HttpStatus
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponseDto, ApiMetaDto, ApiPaginationDto } from '../dtos/api-response.dto';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;
    const path = request.url;
    
    return next.handle().pipe(
      map(data => {
        const meta: ApiMetaDto = {
          timestamp: new Date().toISOString(),
          statusCode,
          path
        };
        
        const pagination = this.extractPaginationData(data);
        if (pagination !== null) {
          meta.pagination = pagination;
        }

        const apiResponse: ApiResponseDto = {
          success: true,
          message: this.getSuccessMessage(statusCode),
          data: this.extractResponseData(data),
          error: undefined,
          meta
        };

        return apiResponse;
      })
    );
  }

  private extractPaginationData(data: any): ApiPaginationDto | null {
    // Check if data has pagination information
    if (data && data.page !== undefined && data.limit !== undefined && data.total !== undefined) {
      return {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: Math.ceil(data.total / data.limit)
      };
    }
    
    // Alternative format some may use
    if (data && data.meta && data.meta.pagination) {
      return data.meta.pagination;
    }
    
    return null;
  }

  private extractResponseData(data: any): any {
    // If data already has a nested data property, extract it
    if (data && data.data !== undefined) {
      return data.data;
    }
    
    // If data has pagination info but also contains items/results array
    if (data && data.items) {
      return data.items;
    }
    
    if (data && data.results) {
      return data.results;
    }
    
    // Otherwise return the data as is
    return data;
  }

  private getSuccessMessage(statusCode: number): string {
    switch(statusCode) {
      case HttpStatus.CREATED:
        return 'Resource created successfully';
      case HttpStatus.OK:
        return 'Request successful';
      case HttpStatus.NO_CONTENT:
        return 'Resource deleted successfully';
      default:
        return 'Operation successful';
    }
  }
} 