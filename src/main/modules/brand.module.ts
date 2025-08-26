import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { User } from '../entities/user.entity';
import { BrandService } from '../service/brand.service';
import { BrandController } from '../controller/brand.controller';
import { BrandRepository } from '../repository/brand.repository';
import { UserRepository } from '../repository/user.repository';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { ProductModule } from './product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, User]),
    LoggerModule,
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepository,
    UserRepository,
  ],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
