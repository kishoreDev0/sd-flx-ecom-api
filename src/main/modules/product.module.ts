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
import { BrandModule } from './brand.module';
import { VendorModule } from './vendor.module';
import { BrandCategoryModule } from './brand-category.module';
import { S3Service } from '../service/s3.service';
import { RolesGuard } from '../commons/guards/roles.guard';
import { CommonUtilService } from '../utils/common.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]),
    LoggerModule,
    forwardRef(() => CategoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => BrandModule),
    forwardRef(() => VendorModule),
    forwardRef(() => BrandCategoryModule),
  ],
  providers: [ProductService, ProductRepository, S3Service, RolesGuard, CommonUtilService],
  controllers: [ProductController],
  exports: [ProductService,ProductRepository],
})
export class ProductModule {}
