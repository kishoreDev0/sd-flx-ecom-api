import { Module ,forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity'; 
import { User } from '../entities/user.entity';
import { CategoryService } from '../service/category.service'; 
import { CategoryController } from '../controller/category.controller'; 
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { CategoryRepository } from '../repository/category.repository';
import { UserRepository } from '../repository/user.repository';
import { CommonUtilService } from '../utils/common.util';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User]),
   LoggerModule,
      forwardRef(() => UserSessionModule),
      forwardRef(() => AuthenticationModule),
    ],
  providers: [CategoryRepository, CategoryService, UserRepository, CommonUtilService],
  controllers: [CategoryController],
  exports: [CategoryRepository,CategoryService],
})
export class CategoryModule {}
