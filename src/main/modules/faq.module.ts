// src/module/faq.module.ts
import { Module ,forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from 'src/main/entities/faq.entity';
import { Product } from 'src/main/entities/product.entity';
import { User } from 'src/main/entities/user.entity';
import { FaqController } from '../controller/faq.controller';
import { FaqService } from '../service/faq.service';
import { FaqRepository } from '../repository/faq.repository';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from '../repository/user.repository';
import { AuthenticationModule } from './authentication.module';
import { UserSessionModule } from './user-session.module';
import { LoggerModule } from './logger.module';


@Module({
  imports: [TypeOrmModule.forFeature([Faq, Product, User]),
  LoggerModule,
       forwardRef(() => UserSessionModule),
      forwardRef(() => AuthenticationModule),
    ],
  controllers: [FaqController],
  providers: [
    FaqService,
    FaqRepository,
    ProductRepository,
    UserRepository,
  ],
})
export class FaqModule {}
