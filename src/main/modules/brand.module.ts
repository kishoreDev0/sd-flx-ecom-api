import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { BrandCategory } from '../entities/brand-category.entity';
import { BrandService } from '../service/brand.service';
import { BrandController } from '../controller/brand.controller';
import { BrandRepository } from '../repository/brand.repository';
import { UserRepository } from '../repository/user.repository';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { ProductModule } from './product.module';
import { UserModule } from './user.module';
import { CategoryModule } from './category.module';
import { CommonUtilService } from '../utils/common.util';
import { VendorModule } from './vendor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, User, Category, BrandCategory]),
    LoggerModule,
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    UserModule,
    CategoryModule,
    forwardRef(() => VendorModule),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepository,
    UserRepository,
    CommonUtilService,
  ],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
