import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from '../entities/attribute.entity';
import { AttributeValue } from '../entities/attribute-value.entity';
import { User } from '../entities/user.entity';
import { AttributeController } from '../controller/attribute.controller';
import { AttributeService } from '../service/attribute.service';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attribute, AttributeValue, User]),
    LoggerModule,
    AuthenticationModule,
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService],
})
export class AttributeModule {}
