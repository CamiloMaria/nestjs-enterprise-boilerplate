# Logger Module

This module provides comprehensive logging capabilities for the application
using nestjs-pino.

## Features

- Structured JSON logging with pretty printing in development
- Automatic HTTP request/response logging
- Detailed error logging with stack traces
- Context-based logging for services and controllers
- Request context binding for all logs
- Sensitive data redaction
- User context enrichment
- Correlation IDs for request tracing

## Components

- **LoggerModule**: Global module that provides logging services
- **LoggerService**: Service that implements NestJS's LoggerService interface
- **LoggerConfig**: Configuration for the Pino logger

## Using the Logger

### In Services/Controllers

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../config/logger/logger.service';

@Injectable()
export class SomeService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(SomeService.name);
  }

  someMethod() {
    this.logger.log('Some message');
    this.logger.debug('Debug message with context');
    this.logger.error('Error message', 'Some trace');
  }
}
```

### Error Handling

The logger includes the LoggerErrorInterceptor which automatically enriches
error logs with stack traces and additional context. Errors thrown in
controllers and services will be properly logged with full stack traces.

## Configuration

The logger is configured in `logger.config.ts`. Key configuration options
include:

- **Log Level**: Configured based on the environment (debug in development, info
  in production)
- **Transport**: Uses pino-pretty in development for human-readable logs
- **Redaction**: Sensitive fields are redacted from logs (passwords, tokens,
  auth headers)
- **Request Context**: All logs include request context (method, URL,
  correlation ID, user info)
- **Custom Serializers**: Controls how request/response objects are serialized
  in logs
- **Auto-Logging**: Configured to log all requests (except health checks)

## Best Practices

1. Always set the context in services and controllers
2. Use appropriate log levels (debug for development, info for general
   operations, warn for concerns, error for failures)
3. Include relevant object data in log messages to aid troubleshooting
4. Avoid logging sensitive information
5. Use structured logging (object parameters) for easier analysis
