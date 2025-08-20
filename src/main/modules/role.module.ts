import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from 'src/main/service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from '../repository/role.repository';
import { Role } from '../entities/role.entity';
import { RoleController } from '../controller/role.controller';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    LoggerModule,
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
