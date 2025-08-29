import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Vendor } from '../entities/vendor.entity';
import { PaymentService } from '../service/payment.service';
import { PaymentController } from '../controller/payment.controller';
import { NotificationModule } from './notification.module';
import { LoggerModule } from './logger.module';
import { UserModule } from './user.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, User, Vendor]),
    NotificationModule,
    LoggerModule,
    UserModule,
    AuthenticationModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
