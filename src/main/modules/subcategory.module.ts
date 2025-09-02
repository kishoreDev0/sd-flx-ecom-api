import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from '../entities/subcategory.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { SubcategoryService } from '../service/subcategory.service';
import { SubcategoryController } from '../controller/subcategory.controller';
import { UserRepository } from '../repository/user.repository';
import { CommonUtilService } from '../utils/common.util';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategory, Category, User]),
    LoggerModule,
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => CategoryModule),
  ],
  providers: [SubcategoryService, UserRepository, CommonUtilService],
  controllers: [SubcategoryController],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
