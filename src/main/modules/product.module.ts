import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductService } from '../service/product.service';
import { ProductRepository } from '../repository/product.repository';
import { ProductController } from '../controller/product.controller';
import { CategoryModule } from './category.module'; // assuming this exists
import { UserModule } from './user.module'; // assuming this exists
import { LoggerModule } from './logger.module'; // assuming this exists
import { User } from '../entities/user.entity';
import { UserSessionModule } from './user-session.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]),
    LoggerModule,
    forwardRef(() => CategoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService,ProductRepository],
})
export class ProductModule {}
