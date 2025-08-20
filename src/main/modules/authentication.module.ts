import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from '../service/auth/authentication.service';
import { AuthenticationController } from '../controller/authentication.controller';
import { User } from 'src/main/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/main/entities/role.entity';
import { LoggerModule } from 'src/main/modules/logger.module';
import { MailModule } from '../email/mail.module';
import { InviteService } from '../service/auth/invite.service';
import { UserRepository } from '../repository/user.repository';
import { UserSessionRepository } from '../repository/user-session.repository';
import { CommonUtilService } from '../utils/common.util';
import { UserSessionService } from '../service/user-session.service';
import { RoleModule } from './role.module';
import { UserSession } from '../entities/user-session.entity';
import { GoogleStrategy } from '../google-sign-in/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleService } from '../google-sign-in/google.service';
import { GoogleModule } from '../google-sign-in/google.module';
import { WishlistModule } from './wishlist.module';
import { CartModule } from './cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Role]),
    LoggerModule,
    MailModule,
    forwardRef(() => RoleModule),
    PassportModule.register({ defaultStrategy: 'google' }),
    GoogleModule,
    WishlistModule,
    CartModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    InviteService,
    UserRepository,
    UserSessionRepository,
    CommonUtilService,
    UserSessionService,
    GoogleStrategy,
    GoogleService,
  ],
  exports: [AuthenticationService, InviteService],
})
export class AuthenticationModule {}
