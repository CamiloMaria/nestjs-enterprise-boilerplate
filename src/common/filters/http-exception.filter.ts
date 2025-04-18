import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto, ApiErrorDto } from '../dtos/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    
    const errorCode = exceptionResponse.error || 'INTERNAL_ERROR';
    let errorDetails = exceptionResponse.message || exception.message;
    
    // Handle validation errors specially
    if (Array.isArray(errorDetails)) {
      errorDetails = errorDetails;
    }
    
    const error: ApiErrorDto = {
      code: errorCode,
      details: errorDetails
    };
    
    const apiResponse: ApiResponseDto = {
      success: false,
      message: this.getErrorMessage(status),
      data: undefined,
      error,
      meta: {
        timestamp: new Date().toISOString(),
        statusCode: status,
        path: request.url,
        pagination: null
      }
    };
    
    response.status(status).json(apiResponse);
  }
  
  private getErrorMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized access';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden resource';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal server error';
      default:
        return 'An error occurred';
    }
  }
} 