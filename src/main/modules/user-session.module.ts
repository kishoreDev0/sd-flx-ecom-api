import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/main/modules/logger.module';
import { AuthenticationModule } from './authentication.module';
import { UserSessionRepository } from '../repository/user-session.repository';
import { UserSession } from '../entities/user-session.entity';
import { UserSessionController } from '../controller/user-session.controller';
import { UserSessionService } from '../service/user-session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession]),
    LoggerModule,
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [UserSessionController],
  providers: [UserSessionService, UserSessionRepository],
  exports: [UserSessionRepository],
})
export class UserSessionModule {}
