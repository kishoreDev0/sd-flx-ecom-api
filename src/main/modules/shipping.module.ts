import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  ShippingAddress, 
  ShippingMethod, 
  ShippingZone, 
  Shipment, 
  ShippingTracking 
} from '../entities/shipping.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { ShippingService } from '../service/shipping.service';
import { ShippingController } from '../controller/shipping.controller';
import { NotificationModule } from './notification.module';
import { LoggerModule } from './logger.module';
import { UserModule } from './user.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShippingAddress, 
      ShippingMethod, 
      ShippingZone, 
      Shipment, 
      ShippingTracking,
      Order,
      User
    ]),
    NotificationModule,
    LoggerModule,
    UserModule,
    AuthenticationModule,
  ],
  providers: [ShippingService],
  controllers: [ShippingController],
  exports: [ShippingService],
})
export class ShippingModule {}
