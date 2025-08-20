// module/static.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Static } from '../entities/static.entity';
import { StaticService } from '../service/static.service';
import { StaticController } from '../controller/static.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Static])],
  providers: [StaticService],
  controllers: [StaticController],
  exports: [StaticService],
})
export class StaticModule {}
