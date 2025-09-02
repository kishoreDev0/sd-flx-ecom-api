import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductFeature } from '../entities/product-feature.entity';
import { ProductAttribute } from '../entities/product-attribute.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Feature } from '../entities/feature.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../entities/user.entity';
import { BrandCategory } from '../entities/brand-category.entity';
import { ProductController } from '../controller/product.controller';
import { ProductService } from '../service/product.service';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductFeature, ProductAttribute, ProductVariant, Feature, Category, Brand, Vendor, User, BrandCategory]),
    LoggerModule,
    AuthenticationModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
