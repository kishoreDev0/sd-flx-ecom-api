import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandCategory } from '../entities/brand-category.entity';
import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { BrandCategoryService } from '../service/brand-category.service';
import { BrandCategoryController } from '../controller/brand-category.controller';
import { BrandCategoryRepository } from '../repository/brand-category.repository';
import { BrandRepository } from '../repository/brand.repository';
import { CategoryRepository } from '../repository/category.repository';
import { UserRepository } from '../repository/user.repository';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { BrandModule } from './brand.module';
import { CategoryModule } from './category.module';
import { UserModule } from './user.module';
import { CommonUtilService } from '../utils/common.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandCategory, Brand, Category, User]),
    LoggerModule,
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => BrandModule),
    forwardRef(() => CategoryModule),
    UserModule,
  ],
  controllers: [BrandCategoryController],
  providers: [
    BrandCategoryService,
    BrandCategoryRepository,
    BrandRepository,
    CategoryRepository,
    UserRepository,
    CommonUtilService,
  ],
  exports: [BrandCategoryService, BrandCategoryRepository],
})
export class BrandCategoryModule {}
