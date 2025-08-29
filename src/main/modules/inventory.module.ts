import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { Vendor } from '../entities/vendor.entity';
import { InventoryService } from '../service/inventory.service';
import { InventoryController } from '../controller/inventory.controller';
import { NotificationModule } from './notification.module';
import { LoggerModule } from './logger.module';
import { UserModule } from './user.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Product, Vendor]),
    NotificationModule,
    LoggerModule,
    UserModule,
    AuthenticationModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
