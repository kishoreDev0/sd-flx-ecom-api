import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderController } from '../controller/order.controller';
import { OrderService } from '../service/order.service';
import { OrderRepository } from '../repository/order.repository';
import { LoggerService } from '../service/logger.service';
import { UserModule } from './user.module'; // assuming this exists
import { AuthenticationModule } from './authentication.module';
import { CartModule } from './cart.module';
import { ProductModule } from './product.module';



@Module({
  imports: [TypeOrmModule.forFeature([Order]),
      forwardRef(() => UserModule),
      forwardRef(() => CartModule),
      forwardRef(() => ProductModule),
      forwardRef(() => AuthenticationModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, LoggerService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}