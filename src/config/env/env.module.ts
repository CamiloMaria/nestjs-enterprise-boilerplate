import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { envValidationSchema } from './validation/env.validation';

/**
 * Global module for environment variable configuration
 * Validates environment variables at startup and provides
 * the EnvService for type-safe access throughout the application
 */
@Global()
@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false, // report all validation errors, not just the first one
        allowUnknown: true, // allow unknown environment variables
      },
      // Load environment variables from .env files in development
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : ['.env', '.env.local', '.env.development'],
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {} 