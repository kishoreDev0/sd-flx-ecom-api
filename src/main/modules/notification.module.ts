import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from '../controller/notification.controller';
import { NotificationService } from '../service/notification.service';
import { NotificationRepository } from '../repository/notification.repository';
import { LoggerModule } from './logger.module';
import { UserSessionModule } from './user-session.module';
import { AuthenticationModule } from './authentication.module';
import { MailModule } from '../email/mail.module';
import { Notification } from '../entities/notification.entity';
import { UserModule } from './user.module';
import { CommonUtilService } from '../utils/common.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    LoggerModule,
    UserSessionModule,
    AuthenticationModule,
    MailModule,
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    CommonUtilService,
  ],
  exports: [
    NotificationService,
    NotificationRepository,
  ],
})
export class NotificationModule {}
