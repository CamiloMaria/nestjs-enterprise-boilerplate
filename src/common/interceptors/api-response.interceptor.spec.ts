import { Test } from '@nestjs/testing';
import { ApiResponseInterceptor } from './api-response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ApiResponseDto } from '../dtos/api-response.dto';

describe('ApiResponseInterceptor', () => {
  let interceptor: ApiResponseInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ApiResponseInterceptor],
    }).compile();

    interceptor = moduleRef.get<ApiResponseInterceptor>(ApiResponseInterceptor);

    // Mock the execution context
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          url: '/test-url',
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
    } as unknown as ExecutionContext;

    // Mock the call handler
    mockCallHandler = {
      handle: jest.fn(),
    } as unknown as CallHandler;
  });

  it('should transform a simple response', (done) => {
    const testData = { foo: 'bar' };
    mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (transformedResponse: ApiResponseDto) => {
        expect(transformedResponse).toBeDefined();
        expect(transformedResponse.success).toBe(true);
        expect(transformedResponse.message).toBe('Request successful');
        expect(transformedResponse.data).toEqual(testData);
        expect(transformedResponse.error).toBeUndefined();
        expect(transformedResponse.meta).toBeDefined();
        expect(transformedResponse.meta.statusCode).toBe(200);
        expect(transformedResponse.meta.path).toBe('/test-url');
        expect(transformedResponse.meta.timestamp).toBeDefined();
        done();
      },
    });
  });

  it('should handle responses with pagination data', (done) => {
    const paginatedData = {
      page: 1,
      limit: 10,
      total: 100,
      items: [{ id: 1 }, { id: 2 }],
    };
    mockCallHandler.handle = jest.fn().mockReturnValue(of(paginatedData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (transformedResponse: ApiResponseDto) => {
        expect(transformedResponse).toBeDefined();
        expect(transformedResponse.success).toBe(true);
        expect(transformedResponse.data).toEqual(paginatedData.items);
        expect(transformedResponse.error).toBeUndefined();
        expect(transformedResponse.meta.pagination).toBeDefined();
        expect(transformedResponse.meta.pagination.page).toBe(1);
        expect(transformedResponse.meta.pagination.limit).toBe(10);
        expect(transformedResponse.meta.pagination.total).toBe(100);
        expect(transformedResponse.meta.pagination.totalPages).toBe(10);
        done();
      },
    });
  });

  it('should extract data from nested data property', (done) => {
    const nestedData = {
      data: { foo: 'bar' },
    };
    mockCallHandler.handle = jest.fn().mockReturnValue(of(nestedData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (transformedResponse: ApiResponseDto) => {
        expect(transformedResponse).toBeDefined();
        expect(transformedResponse.data).toEqual(nestedData.data);
        expect(transformedResponse.error).toBeUndefined();
        done();
      },
    });
  });

  it('should adapt message based on status code', (done) => {
    // Override status code to 201 (Created)
    const httpContext = mockExecutionContext.switchToHttp();
    jest.spyOn(httpContext, 'getResponse').mockReturnValue({
      statusCode: 201,
    });

    mockCallHandler.handle = jest.fn().mockReturnValue(of({ id: 123 }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (transformedResponse: ApiResponseDto) => {
        expect(transformedResponse).toBeDefined();
        expect(transformedResponse.message).toBe('Resource created successfully');
        expect(transformedResponse.meta.statusCode).toBe(201);
        expect(transformedResponse.error).toBeUndefined();
        done();
      },
    });
  });

  it('should always set error to undefined regardless of input', (done) => {
    // Try to provide a response with both data and error
    const malformedData = {
      data: { foo: 'bar' },
      error: { code: 'SOME_ERROR', details: 'This should not appear' }
    };
    mockCallHandler.handle = jest.fn().mockReturnValue(of(malformedData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (transformedResponse: ApiResponseDto) => {
        expect(transformedResponse).toBeDefined();
        expect(transformedResponse.data).toEqual(malformedData.data);
        expect(transformedResponse.error).toBeUndefined();
        done();
      },
    });
  });
}); 