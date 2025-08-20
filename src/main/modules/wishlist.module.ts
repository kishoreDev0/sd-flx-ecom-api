import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { WishlistService } from '../service/wishlist.service';
import { WishlistController } from '../controller/wishlist.controller';
import { WishlistRepository } from '../repository/wishlist.repository';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from '../repository/user.repository';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { CartModule } from './cart.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, User, Product]),
    LoggerModule,
     forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => CartModule),
  ],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    WishlistRepository,
    UserRepository,
    ProductRepository,
    
  ],
  exports: [WishlistService, WishlistRepository],
})
export class WishlistModule {}
