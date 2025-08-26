import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger } from 'src/main/config/logger.config';
import winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = createLogger();
  }

  log(message: string, context?: any): void {
    if (context) {
      this.logger.info(`${message} ${JSON.stringify(context)}`);
    } else {
      this.logger.info(message);
    }
  }

  error(message: string, context?: any): void {
    if (context) {
      this.logger.error(`${message} ${JSON.stringify(context)}`);
    } else {
      this.logger.error(message);
    }
  }

  warn(message: string, context?: any): void {
    if (context) {
      this.logger.warn(`${message} ${JSON.stringify(context)}`);
    } else {
      this.logger.warn(message);
    }
  }

  info(message: string, context?: any): void {
    if (context) {
      this.logger.info(`${message} ${JSON.stringify(context)}`);
    } else {
      this.logger.info(message);
    }
  }

  debug(message: string, context?: any): void {
    if (context) {
      this.logger.debug(`${message} ${JSON.stringify(context)}`);
    } else {
      this.logger.debug(message);
    }
  }

  verbose(message: string, context?: any): void {
    if (context) {
      this.logger.verbose(`${message} ${JSON.stringify(context)}`);
    } else {
      this.logger.verbose(message);
    }
  }
}
