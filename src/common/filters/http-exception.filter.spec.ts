import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponseDto } from '../dtos/api-response.dto';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;
  let mockJson: jest.Mock;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);

    // Setup mock response and request
    mockJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockJson,
    };
    
    mockRequest = {
      url: '/test-url',
    };

    // Setup mock arguments host
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should transform a basic HttpException', () => {
    const exception = new HttpException('Test error message', HttpStatus.BAD_REQUEST);
    
    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalled();
    
    const responseBody: ApiResponseDto = mockJson.mock.calls[0][0];
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toBe('Bad request');
    expect(responseBody.data).toBeUndefined();
    expect(responseBody.error).toBeDefined();
    expect(responseBody.error.code).toBe('INTERNAL_ERROR');
    expect(responseBody.error.details).toBe('Test error message');
    expect(responseBody.meta.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(responseBody.meta.path).toBe('/test-url');
    expect(responseBody.meta.timestamp).toBeDefined();
    expect(responseBody.meta.pagination).toBeNull();
  });

  it('should handle validation errors with array of messages', () => {
    const validationErrors = ['Field1 is required', 'Field2 is invalid'];
    const exception = new HttpException(
      {
        message: validationErrors,
        error: 'VALIDATION_ERROR',
      },
      HttpStatus.BAD_REQUEST
    );
    
    filter.catch(exception, mockArgumentsHost);
    
    const responseBody: ApiResponseDto = mockJson.mock.calls[0][0];
    expect(responseBody.error.code).toBe('VALIDATION_ERROR');
    expect(responseBody.error.details).toEqual(validationErrors);
    expect(responseBody.data).toBeUndefined();
  });

  it('should handle unauthorized error', () => {
    const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    
    filter.catch(exception, mockArgumentsHost);
    
    const responseBody: ApiResponseDto = mockJson.mock.calls[0][0];
    expect(responseBody.message).toBe('Unauthorized access');
    expect(responseBody.meta.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(responseBody.data).toBeUndefined();
  });

  it('should handle not found error', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    
    filter.catch(exception, mockArgumentsHost);
    
    const responseBody: ApiResponseDto = mockJson.mock.calls[0][0];
    expect(responseBody.message).toBe('Resource not found');
    expect(responseBody.meta.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(responseBody.data).toBeUndefined();
  });
  
  it('should never include data in the error response', () => {
    // Create an exception with a data property that should be ignored
    const exceptionWithData = new HttpException(
      {
        message: 'Error with data',
        error: 'DATA_ERROR',
        data: { shouldNot: 'appear' }
      },
      HttpStatus.BAD_REQUEST
    );
    
    filter.catch(exceptionWithData, mockArgumentsHost);
    
    const responseBody: ApiResponseDto = mockJson.mock.calls[0][0];
    expect(responseBody.data).toBeUndefined();
    expect(responseBody.error).toBeDefined();
  });
}); 