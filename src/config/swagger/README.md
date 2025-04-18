# Swagger Module

This module provides API documentation using Swagger/OpenAPI, making your API
discoverable, testable, and easy to integrate with.

## Features

- Auto-generated API documentation
- Interactive API explorer UI
- Support for API versioning
- Authentication documentation
- Request/response schema documentation
- Custom example responses
- Operation-specific configuration
- API response standardization

## Configuration

The Swagger module is configured via environment variables:

| Environment Variable    | Description                          | Default Value |
| ----------------------- | ------------------------------------ | ------------- |
| SWAGGER_ENABLED         | Enable/disable Swagger documentation | true          |
| SWAGGER_TITLE           | API documentation title              | NestJS API    |
| SWAGGER_DESCRIPTION     | API description                      | -             |
| SWAGGER_VERSION         | API version displayed in docs        | 1.0           |
| SWAGGER_DOCUMENT_SUFFIX | URL path for Swagger UI              | docs          |

## Usage

### Basic Usage

The Swagger documentation is automatically generated based on your controllers
and DTOs. You can enhance it with decorators:

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [User],
  })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a user by ID',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }
}
```

### DTO Documentation

Document your DTOs using Swagger decorators:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    example: 'password123',
    writeOnly: true, // Won't be included in response schemas
  })
  @IsString()
  @MinLength(8)
  password: string;
}
```

### Custom Response Example

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'Unique user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: ['user', 'admin', 'moderator'],
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-10-15T14:30:00Z',
  })
  createdAt: Date;
}
```

### Authentication Documentation

Document authentication requirements for your endpoints:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('profile')
@Controller('profile')
@ApiBearerAuth('JWT-auth') // References the auth scheme defined in swagger config
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  getProfile() {
    return { name: 'John Doe', email: 'john@example.com' };
  }
}
```

### API Responses with Standard Format

Integration with the API response interceptor to document standard response
format:

```typescript
import { ApiProperty } from '@nestjs/swagger';

// Standard API response schema for Swagger
export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Request successful' })
  message: string;

  @ApiProperty({ example: { id: 1, name: 'Example' } })
  data?: T;

  @ApiProperty({
    example: {
      code: 'UNAUTHORIZED',
      details: 'Authentication token is invalid'
    },
    nullable: true
  })
  error?: {
    code: string;
    details?: any;
  };

  @ApiProperty({
    example: {
      timestamp: '2023-10-15T14:30:00Z',
      statusCode: 200,
      path: '/api/resource'
    }
  })
  meta: {
    timestamp: string;
    statusCode: number;
    path: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Then in your controller:
@ApiOkResponse({
  description: 'Successfully retrieved users',
  type: ApiResponseDto,
  schema: {
    properties: {
      data: {
        type: 'array',
        items: { $ref: getSchemaPath(User) }
      }
    }
  }
})
```

## Access Swagger UI

When your application is running, you can access the Swagger documentation UI
at:

```
http://localhost:3000/api/docs
```

The URL is constructed as:
`http://{HOST}:{PORT}/{API_PREFIX}/{SWAGGER_DOCUMENT_SUFFIX}`

## Best Practices

1. Always add `@ApiTags` to controllers to organize endpoints by category
2. Use `@ApiOperation` to provide a clear summary of what each endpoint does
3. Document all possible responses with `@ApiResponse`
4. Add examples to make your documentation more user-friendly
5. Use `@ApiProperty` on all DTO properties with descriptions and examples
6. Document authentication requirements with `@ApiBearerAuth`
7. Keep documentation up-to-date with code changes
