# API Versioning Module

This module provides robust API versioning capabilities for the application,
enabling seamless evolution of your API without breaking existing clients.

## Features

- URI, Header, and Media Type versioning strategies
- Version-specific endpoints
- Version-neutral endpoints
- Version validation and access control
- Deprecated version handling
- Swagger documentation integration

## Configuration

The versioning module is configured via environment variables:

| Environment Variable    | Description                                   | Default Value   |
| ----------------------- | --------------------------------------------- | --------------- |
| API_VERSION             | Current API version                           | 1               |
| API_SUPPORTED_VERSIONS  | Comma-separated list of supported versions    | Current version |
| API_DEPRECATED_VERSIONS | Comma-separated list of deprecated versions   | (empty)         |
| API_VERSIONING_TYPE     | Versioning strategy (uri, header, media-type) | uri             |
| API_VERSIONING_HEADER   | Header name for header versioning             | X-API-Version   |
| API_VERSIONING_ENABLED  | Enable/disable versioning                     | true            |

## Usage

### Basic Versioned Controller

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiVersion } from 'src/modules/versioning/decorators';

// Version 1 Controller
@Controller('users')
@ApiVersion('1')
export class UsersV1Controller {
  @Get()
  findAll() {
    return [{ id: 1, name: 'User 1', email: 'user1@example.com' }];
  }
}

// Version 2 Controller (with additional fields)
@Controller('users')
@ApiVersion('2')
export class UsersV2Controller {
  @Get()
  findAll() {
    return [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        role: 'admin', // New field in V2
        createdAt: new Date(),
      },
    ];
  }
}
```

### Version-Specific Route Handler

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiVersion } from 'src/modules/versioning/decorators';

@Controller('posts')
export class PostsController {
  // Version 1 handler
  @Get()
  @ApiVersion('1')
  findAllV1() {
    return [{ id: 1, title: 'Post 1', content: 'Content 1' }];
  }

  // Version 2 handler with additional data
  @Get()
  @ApiVersion('2')
  findAllV2() {
    return [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        author: 'John Doe',
        tags: ['news', 'featured'],
      },
    ];
  }
}
```

### Version-Neutral Endpoint

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiVersionNeutral } from 'src/modules/versioning/decorators';

@Controller('health')
export class HealthController {
  @Get()
  @ApiVersionNeutral() // This endpoint will be accessible via any version
  getHealth() {
    return { status: 'ok' };
  }
}
```

### Marking a Version as Deprecated

```typescript
import { Controller, Get } from '@nestjs/common';
import {
  ApiVersion,
  ApiVersionDeprecated,
} from 'src/modules/versioning/decorators';

@Controller('legacy')
@ApiVersion('1')
@ApiVersionDeprecated('1', 'Please migrate to v2 by December 2023')
export class LegacyController {
  @Get()
  findAll() {
    return { message: 'This is a deprecated endpoint' };
  }
}
```

## Versioning Strategies

### URI Versioning

URI versioning includes the version in the URL path:

```
GET /api/v1/users
GET /api/v2/users
```

### Header Versioning

Header versioning includes the version in a custom header:

```
GET /api/users
X-API-Version: 1

GET /api/users
X-API-Version: 2
```

### Media Type Versioning

Media type versioning includes the version in the Accept header:

```
GET /api/users
Accept: application/json;version=1

GET /api/users
Accept: application/json;version=2
```
