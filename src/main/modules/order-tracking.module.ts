import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTrackingController } from '../controller/order-tracking.controller';
import { OrderTrackingService } from '../service/order-tracking.service';
import { OrderTrackingRepository } from '../repository/order-tracking.repository';
import { OrderRepository } from '../repository/order.repository';
import { LoggerModule } from './logger.module';
import { UserSessionModule } from './user-session.module';
import { AuthenticationModule } from './authentication.module';
import { MailModule } from '../email/mail.module';
import { Order } from '../entities/order.entity';
import { OrderTracking } from '../entities/order-tracking.entity';
import { NotificationModule } from './notification.module';
import { UserModule } from './user.module';
import { CommonUtilService } from '../utils/common.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderTracking]),
    LoggerModule,
    UserSessionModule,
    AuthenticationModule,
    MailModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [OrderTrackingController],
  providers: [
    OrderTrackingService,
    OrderTrackingRepository,
    OrderRepository,
    CommonUtilService,
  ],
  exports: [
    OrderTrackingService,
    OrderTrackingRepository,
  ],
})
export class OrderTrackingModule {}
