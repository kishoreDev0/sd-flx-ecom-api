import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { mailConfigAsync } from '../config/mail.config';
import { MailService } from './mail.service';
import { CustomLoggerService } from '../service/custom-logger.service';

@Global()
@Module({
  imports: [MailerModule.forRootAsync(mailConfigAsync)],
  providers: [MailService, CustomLoggerService],
  exports: [MailService, CustomLoggerService],
})
export class MailModule {}
