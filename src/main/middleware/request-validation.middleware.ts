import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate content type for POST/PUT/PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        this.validateContentType(req);
      }

      // Validate request size
      this.validateRequestSize(req);

      next();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private validateContentType(req: Request): void {
    const contentType = req.headers['content-type'];
    
    if (!contentType) {
      throw new BadRequestException('Content-Type header is required');
    }

    // Allow JSON and form data
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
    ];

    const isValidType = allowedTypes.some(type => 
      contentType.includes(type)
    );

    if (!isValidType) {
      throw new BadRequestException('Invalid Content-Type header');
    }
  }

  private validateRequestSize(req: Request): void {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
      throw new BadRequestException('Request body too large');
    }
  }
}
