# Throttler Module

This module provides rate limiting capabilities to protect API endpoints from
abuse and ensure fair resource distribution.

## Features

- Configurable request rate limiting
- Support for global and endpoint-specific limits
- Customizable TTL (Time-To-Live) settings
- Skip options for trusted sources
- Storage TTL configuration
- Custom decorators for fine-grained control

## Configuration

The throttler module is configured via environment variables:

| Environment Variable    | Description                           | Default Value |
| ----------------------- | ------------------------------------- | ------------- |
| THROTTLER_ENABLED       | Enable/disable rate limiting          | true          |
| THROTTLER_TTL           | Time window in milliseconds           | 60000 (60s)   |
| THROTTLER_LIMIT         | Maximum number of requests within TTL | 10            |
| THROTTLER_SKIP_IF_EMPTY | Skip throttling if storage is empty   | false         |
| THROTTLER_STORAGE_TTL   | How long to keep rate limit records   | 3600 (1 hour) |

## Usage

### Basic Usage

The throttler is applied globally to all endpoints by default. You can customize
throttling settings using decorators.

```typescript
import { Controller, Get } from '@nestjs/common';
import { Throttle, SkipThrottle } from 'src/config/throttler/decorators';

@Controller('api')
export class ApiController {
  @Get('public')
  // Default throttling applied from global settings
  public getPublicData() {
    return { message: 'Public data' };
  }

  @Get('limited')
  @Throttle(5, 30000) // Custom: 5 requests per 30 seconds
  public getLimitedData() {
    return { message: 'Rate-limited data' };
  }

  @Get('internal')
  @SkipThrottle() // Skip throttling for this endpoint
  public getInternalData() {
    return { message: 'Internal data without rate limiting' };
  }
}
```

### Applying to Specific Controllers

You can apply throttling to entire controllers:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Throttle } from 'src/config/throttler/decorators';

@Controller('high-traffic')
@Throttle(20, 60000) // 20 requests per minute for all endpoints in this controller
export class HighTrafficController {
  @Get()
  public getData() {
    return { message: 'Rate-limited controller' };
  }

  @Get('special')
  @Throttle(5, 60000) // Override: 5 requests per minute for this specific endpoint
  public getSpecialData() {
    return { message: 'Highly rate-limited endpoint' };
  }
}
```

### Skipping for Trusted Sources

You can implement custom logic to skip throttling for trusted sources:

```typescript
// throttler.guard.ts (custom implementation)
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Skip for internal IPs
    const clientIp = request.ip;
    if (clientIp === '127.0.0.1' || clientIp.startsWith('10.0.')) {
      return true;
    }

    // Skip for API keys
    const apiKey = request.headers['x-api-key'];
    if (apiKey === 'trusted-internal-key') {
      return true;
    }

    // Otherwise use standard throttling rules
    return super.shouldSkip(context);
  }
}
```

## Response Headers

When throttling is applied, the following headers are included in the response:

- `X-RateLimit-Limit`: Maximum number of requests allowed in the time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets

## Error Response

When a client exceeds the rate limit, they receive a `429 Too Many Requests`
response with the following structure:

```json
{
  "success": false,
  "message": "Too many requests",
  "error": {
    "code": "THROTTLED",
    "details": "Rate limit exceeded. Try again in X seconds"
  },
  "meta": {
    "timestamp": "2023-10-15T14:30:00Z",
    "statusCode": 429,
    "path": "/api/limited"
  }
}
```

## Best Practices

1. Apply stricter limits to authentication and high-resource endpoints
2. Use higher limits for public read-only endpoints
3. Consider using different limits for authenticated vs anonymous users
4. Monitor rate limiting metrics to adjust settings as needed
5. Add appropriate client-side handling for 429 responses (backoff, retry)
