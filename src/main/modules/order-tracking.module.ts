import { Module } from '@nestjs/common';
import { OrderTrackingController } from '../controller/order-tracking.controller';
import { OrderTrackingService } from '../service/order-tracking.service';
import { OrderTrackingRepository } from '../repository/order-tracking.repository';
import { OrderRepository } from '../repository/order.repository';
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
  controllers: [OrderTrackingController],
  providers: [
    OrderTrackingService,
    OrderTrackingRepository,
    OrderRepository,
    NotificationService,
    NotificationRepository,
  ],
  exports: [
    OrderTrackingService,
    OrderTrackingRepository,
  ],
})
export class OrderTrackingModule {}
