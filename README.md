# NestJS Enterprise Boilerplate

A robust NestJS boilerplate with enterprise-grade practices implemented using
SOLID principles, designed to kickstart your backend development with a
production-ready foundation.

## Features

- **TypeScript** - Type safety and modern JavaScript features
- **SOLID Architecture** - Well-organized, maintainable, and testable code
  structure
- **Environment Configuration** - Type-safe access to environment variables with
  validation using Joi
- **API Documentation** - Auto-generated Swagger/OpenAPI documentation
- **API Versioning** - Support for URI, header, and media-type versioning
  strategies
- **Standardized Responses** - Consistent API response format with proper status
  codes
- **Error Handling** - Global exception filters with detailed error codes
- **Logging** - Structured logging with nestjs-pino
- **Rate Limiting** - Protection against abuse with configurable throttling
- **Health Checks** - Endpoints for application health monitoring
- **SWC Compiler** - Faster development with SWC instead of TypeScript compiler

## Project Structure

```
src/
├── common/                        # Shared utilities
│   ├── decorators/                # Custom decorators
│   ├── dtos/                      # Data Transfer Objects
│   ├── filters/                   # Exception filters
│   └── interceptors/              # Interceptors for requests/responses
├── config/                        # Configuration modules
│   ├── env/                       # Environment configuration
│   ├── logger/                    # Logging configuration
│   ├── swagger/                   # API documentation
│   ├── throttler/                 # Rate limiting
│   └── versioning/                # API versioning
├── modules/                       # Feature modules
│   └── health/                    # Health check endpoints
└── main.ts                        # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nestjs-enterprise-boilerplate.git
   cd nestjs-enterprise-boilerplate
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file:

   ```
   NODE_ENV=development
   PORT=3000
   HOST=localhost
   API_PREFIX=api

   # Swagger
   SWAGGER_ENABLED=true
   SWAGGER_TITLE=NestJS API
   SWAGGER_DESCRIPTION=NestJS API Documentation
   SWAGGER_VERSION=1.0
   SWAGGER_DOCUMENT_SUFFIX=docs

   # API Versioning
   API_VERSIONING_ENABLED=true
   API_VERSION=1
   API_SUPPORTED_VERSIONS=1
   API_VERSIONING_TYPE=uri
   API_VERSIONING_HEADER=X-API-Version

   # CORS
   CORS_ENABLED=true
   CORS_ORIGIN=*

   # Throttling
   THROTTLER_ENABLED=true
   THROTTLER_TTL=60000
   THROTTLER_LIMIT=10
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm build`: Build the application
- `pnpm start`: Start the production server
- `pnpm dev`: Start the development server with hot-reload
- `pnpm start:debug`: Start the server in debug mode
- `pnpm lint`: Run ESLint
- `pnpm test`: Run tests
- `pnpm test:cov`: Run tests with coverage

## Core Modules

### Environment Configuration

Type-safe access to environment variables with Joi validation:

```typescript
// Access environment variables
constructor(private envService: EnvService) {
  const port = this.envService.port;
  const isProduction = this.envService.isProduction;
}
```

### API Response Format

All API responses follow a standardized format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": { ... },
  "meta": {
    "timestamp": "2023-10-15T14:30:00Z",
    "statusCode": 200,
    "path": "/api/resource"
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Authentication failed",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "The provided credentials are incorrect"
  },
  "meta": {
    "timestamp": "2023-10-15T14:30:00Z",
    "statusCode": 401,
    "path": "/api/auth/login"
  }
}
```

### Logging

Structured logging with nestjs-pino:

```typescript
// In any service
private logger = new Logger(YourService.name);

async someMethod() {
  this.logger.log('Processing request');
  try {
    // do something
  } catch (error) {
    this.logger.error('Failed to process request', error.stack);
    throw error;
  }
}
```

For detailed documentation on the Logger module, see
[src/config/logger/README.md](src/config/logger/README.md).

### API Versioning

Routes can be versioned using the `@Version` decorator:

```typescript
// Controller with URI versioning
@Controller('users')
export class UsersController {
  @Get()
  @Version('1')
  findAllV1() {
    // v1 implementation
  }

  @Get()
  @Version('2')
  findAllV2() {
    // v2 implementation with enhanced features
  }
}
```

For comprehensive documentation on API versioning strategies, see
[src/config/versioning/README.md](src/config/versioning/README.md).

### Rate Limiting

Protect your API from abuse with configurable rate limiting:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Throttle, SkipThrottle } from 'src/config/throttler/decorators';

@Controller('api')
export class ApiController {
  @Get('limited')
  @Throttle(5, 30000) // 5 requests per 30 seconds
  public getLimitedData() {
    return { message: 'Rate-limited data' };
  }
}
```

For detailed documentation on the Throttler module, see
[src/config/throttler/README.md](src/config/throttler/README.md).

### API Documentation

Auto-generated Swagger documentation with interactive UI:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('example')
@Controller('example')
export class ExampleController {
  @Get()
  @ApiOperation({ summary: 'Get example data' })
  getExample() {
    return { message: 'Example data' };
  }
}
```

For comprehensive documentation on the Swagger module, see
[src/config/swagger/README.md](src/config/swagger/README.md).

## Development Guidelines

### Adding a New Feature Module

1. Create a new directory in `src/modules`
2. Implement the module following SOLID principles:
   - Define interfaces in `interfaces/`
   - Create DTOs in `dtos/`
   - Implement services in `services/`
   - Create controllers in `controllers/`
3. Register the module in `app.module.ts`

### Environment Variables

1. Add the new variable to `src/config/env/constants/env.constants.ts`
2. Add validation in `src/config/env/validation/env.validation.ts`
3. Add accessor in `src/config/env/env.service.ts`

## Module Documentation

Each core module in this boilerplate includes its own README with detailed
documentation:

- **Logger Module**: [src/config/logger/README.md](src/config/logger/README.md)
- **Versioning Module**:
  [src/config/versioning/README.md](src/config/versioning/README.md)
- **Throttler Module**:
  [src/config/throttler/README.md](src/config/throttler/README.md)
- **Swagger Module**:
  [src/config/swagger/README.md](src/config/swagger/README.md)

## License

This project is licensed under the MIT License - see the LICENSE file for
details.
