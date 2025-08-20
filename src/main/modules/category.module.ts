import { Module ,forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity'; 
import { CategoryService } from '../service/category.service'; 
import { CategoryController } from '../controller/category.controller'; 
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { ProductModule } from './product.module';
import { CategoryRepository } from '../repository/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category]),
   LoggerModule,
      forwardRef(() => UserSessionModule),
      forwardRef(() => AuthenticationModule),
      forwardRef(() => ProductModule),
    ],
  providers: [CategoryRepository,CategoryService],
  controllers: [CategoryController],
  exports: [CategoryRepository,CategoryService],
})
export class CategoryModule {}
