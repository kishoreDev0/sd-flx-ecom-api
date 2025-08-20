// src/module/feature.module.ts
import { Module ,forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from 'src/main/entities/feature.entity';
import { Product } from 'src/main/entities/product.entity';
import { User } from 'src/main/entities/user.entity';
import { FeatureController } from '../controller/feature.controller';
import { FeatureService } from '../service/feature.service';
import { FeatureRepository } from '../repository/feature.repository';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from '../repository/user.repository';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { LoggerModule } from './logger.module';


@Module({
  imports: [TypeOrmModule.forFeature([Feature, Product, User]),
  LoggerModule,
       forwardRef(() => UserSessionModule),
      forwardRef(() => AuthenticationModule),
    ],
  controllers: [FeatureController],
  providers: [
    FeatureService,
    FeatureRepository,
    ProductRepository,
    UserRepository,
  ],
})
export class FeatureModule {}
