import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';

// Define interface for extended request with user property
interface ExtendedRequest extends IncomingMessage {
  user?: { id: string | number; role?: string };
}

/**
 * Logger configuration for the application
 * - JSON format in production
 * - Pretty format in development
 * - Redacts sensitive information
 * - Adds correlation IDs
 * - Sets log level based on response status
 * - Includes request/response information with proper serialization
 */
export const LoggerConfig = LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: { 
              singleLine: true, 
              colorize: true,
              customColors: {
                error: 'red',
                warn: 'yellow',
                info: 'green',
                debug: 'blue',
                trace: 'magenta',
                message: 'cyan',
              },
            },
          },
    // Enhanced redaction patterns to include common sensitive fields
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      'req.body.password',
      'req.body.token',
      'req.body.accessToken',
      'req.body.refreshToken',
      'req.body.creditCard',
      'req.query.token',
      'req.query.key',
    ],
    customProps: (req, res) => {
      // Type assertion to ExtendedRequest
      const extendedReq = req as ExtendedRequest;
      
      return {
        correlationId:
          req.id || `req-${Math.random().toString(36).substring(2, 10)}`,
        // Add user information if available
        user: extendedReq.user ? { 
          id: extendedReq.user.id, 
          role: extendedReq.user.role 
        } : undefined,
        // Include API version from headers or URL pattern if available
        apiVersion: req.headers['accept-version'] || 
                  (req.url?.match(/\/v(\d+)\//) ? req.url.match(/\/v(\d+)\//)[1] : undefined),
      };
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: req.headers,
        // Include request body for non-GET requests but limit size
        ...(req.method !== 'GET' && req.body && {
          body: Object.keys(req.body).length > 20 
            ? { truncated: true, size: JSON.stringify(req.body).length } 
            : req.body
        }),
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: res.headers,
      }),
    },
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    // Add timestamp to all logs
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    // Enable auto-logging of requests
    autoLogging: {
      ignore: (req) => req.url?.includes('/health') || false, // Optionally ignore health check endpoints to reduce noise
    },
  },
}); 