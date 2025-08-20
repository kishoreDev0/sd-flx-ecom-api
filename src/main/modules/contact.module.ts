import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../entities/contact-us.entity';
import { LoggerModule } from './logger.module';
import { ContactService } from '../service/contact.service';
import { ContactController } from '../controller/contact.controller';
import { UserModule } from './user.module';
import { OrderModule } from './order.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    LoggerModule,
    forwardRef(() => UserModule),
     forwardRef(() => OrderModule),
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
