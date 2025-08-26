import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/logger.service';

@Injectable()
export class SecurityLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    const method = req.method;
    const url = req.url;
    const referer = req.headers.referer || 'Direct';

    // Log suspicious activities
    this.logSuspiciousActivity(req, ip, userAgent);

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const statusCode = res.statusCode;

      // Log security events
      this.logSecurityEvent({
        ip,
        method,
        url,
        statusCode,
        duration,
        userAgent,
        referer,
        timestamp: new Date().toISOString(),
      });

      originalEnd.call(this, chunk, encoding);
    }.bind(this);

    next();
  }

  private logSuspiciousActivity(req: Request, ip: string, userAgent: string): void {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /update\s+set/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /document\./i,
      /window\./i,
    ];

    const requestData = JSON.stringify({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    });

    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(requestData) || pattern.test(userAgent)
    );

    if (isSuspicious) {
      this.logger.warn('Suspicious activity detected', {
        ip,
        userAgent,
        url: req.url,
        method: req.method,
        suspiciousData: requestData,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private logSecurityEvent(event: {
    ip: string;
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    userAgent: string;
    referer: string;
    timestamp: string;
  }): void {
    // Log failed authentication attempts
    if (event.url.includes('/auth') && event.statusCode === 401) {
      this.logger.warn('Failed authentication attempt', event);
    }

    // Log successful authentication
    if (event.url.includes('/auth') && event.statusCode === 200) {
      this.logger.info('Successful authentication', event);
    }

    // Log admin actions
    if (event.url.includes('/admin') || event.url.includes('/admin/')) {
      this.logger.info('Admin action performed', event);
    }

    // Log file uploads
    if (event.url.includes('/upload') || event.url.includes('/file')) {
      this.logger.info('File upload attempt', event);
    }

    // Log errors
    if (event.statusCode >= 400) {
      this.logger.error('HTTP Error', event);
    }

    // Log slow requests
    if (event.duration > 5000) { // 5 seconds
      this.logger.warn('Slow request detected', event);
    }
  }
}
