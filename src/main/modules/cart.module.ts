import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CartService } from '../service/cart.service';
import { CartController } from '../controller/cart.controller';
import { CartRepository } from '../repository/cart.repository';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from '../repository/user.repository';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, User, Product]),
    LoggerModule,
     forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    UserRepository,
    ProductRepository,
  ],
  exports: [CartService, CartRepository],
})
export class CartModule {}
