import { Module } from '@nestjs/common';
import { NotificationController } from '../controller/notification.controller';
import { NotificationService } from '../service/notification.service';
import { NotificationRepository } from '../repository/notification.repository';
import { LoggerModule } from './logger.module';
import { UserSessionModule } from './user-session.module';
import { AuthenticationModule } from './authentication.module';
import { MailModule } from '../email/mail.module';

@Module({
  imports: [
    LoggerModule,
    UserSessionModule,
    AuthenticationModule,
    MailModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
  ],
  exports: [
    NotificationService,
    NotificationRepository,
  ],
})
export class NotificationModule {}
