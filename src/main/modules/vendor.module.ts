import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../entities/user.entity';
import { VendorService } from '../service/vendor.service';
import { VendorController } from '../controller/vendor.controller';
import { VendorRepository } from '../repository/vendor.repository';
import { UserRepository } from '../repository/user.repository';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { BrandModule } from './brand.module';
import { ProductModule } from './product.module';
import { UserModule } from './user.module';
import { CommonUtilService } from '../utils/common.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, User]),
    LoggerModule,
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => BrandModule),
    UserModule,
  ],
  controllers: [VendorController],
  providers: [
    VendorService,
    VendorRepository,
    UserRepository,
    CommonUtilService,
  ],
  exports: [VendorService, VendorRepository],
})
export class VendorModule {}
