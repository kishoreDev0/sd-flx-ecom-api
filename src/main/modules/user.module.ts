import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserRepository } from '../repository/user.repository';
import { UserSessionModule } from './user-session.module';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { RoleRepository } from '../repository/role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    LoggerModule,
    forwardRef(() => UserSessionModule),
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
