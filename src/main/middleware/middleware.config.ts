import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SecurityMiddleware } from './security.middleware';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { RequestValidationMiddleware } from './request-validation.middleware';
import { SecurityLoggingMiddleware } from './security-logging.middleware';
import { LoggerModule } from '../modules/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    SecurityMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    SecurityLoggingMiddleware,
  ],
  exports: [
    SecurityMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    SecurityLoggingMiddleware,
  ],
})
export class MiddlewareConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply security middleware to all routes
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*');

    // Apply rate limiting to all routes
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');

    // Apply request validation to all routes
    consumer
      .apply(RequestValidationMiddleware)
      .forRoutes('*');

    // Apply security logging to all routes
    consumer
      .apply(SecurityLoggingMiddleware)
      .forRoutes('*');
  }
}
