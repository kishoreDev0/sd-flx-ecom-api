import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    keyGenerator: (req) => {
      return req.ip + req.path; // Use IP + path as key
    },
  });

  private apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs for general API
    message: {
      error: 'Too many API requests from this IP, please try again later.',
      retryAfter: '15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });

  private uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 upload requests per hour
    message: {
      error: 'Too many upload attempts, please try again later.',
      retryAfter: '1 hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });

  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;

    // Apply different rate limits based on endpoint type
    if (path.includes('/auth') || path.includes('/login') || path.includes('/register')) {
      this.authLimiter(req, res, next);
    } else if (path.includes('/upload') || path.includes('/file')) {
      this.uploadLimiter(req, res, next);
    } else {
      this.apiLimiter(req, res, next);
    }
  }
}
