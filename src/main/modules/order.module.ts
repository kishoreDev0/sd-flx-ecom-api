import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../entities/user.entity';
import { OrderController } from '../controller/order.controller';
import { OrderService } from '../service/order.service';
import { NotificationModule } from './notification.module';
import { InventoryModule } from './inventory.module';
import { LoggerModule } from './logger.module';
import { UserModule } from './user.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Vendor, User]),
    NotificationModule,
    InventoryModule,
    LoggerModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}