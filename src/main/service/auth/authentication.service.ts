import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from 'src/main/dto/requests/auth/login.dto';
import { ForgotPasswordDto } from 'src/main/dto/requests/auth/forgotPassword.dto';
import { ChangePasswordDto } from 'src/main/dto/requests/auth/recoverPassword.dto';
import { ResetPasswordDto } from 'src/main/dto/requests/auth/resetPassword.dto';
import { LoggerService } from 'src/main/service/logger.service';
import { MailService } from 'src/main/email/mail.service';
import { authConstants } from 'src/main/commons/constants/authentication/authentication.constants';
import {
  mailSubject,
  mailTemplates,
} from 'src/main/commons/constants/email/mail.constants';
import { UserSessionRepository } from 'src/main/repository/user-session.repository';
import { UserRepository } from 'src/main/repository/user.repository';
import { User } from 'src/main/entities/user.entity';
import { Role } from 'src/main/entities/role.entity';
import { GeneratePasswordDto } from 'src/main/dto/requests/auth/generate-password.dto';
import { AUTH_RESPONSES } from 'src/main/commons/constants/response-constants/auth.constant';
import {
  ChangePasswordResponseDto,
  FailureResposneDto,
  ForgotPasswordResponseDto,
  GeneratePasswordResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  ResetPasswordResponseDto,
} from 'src/main/dto/responses/auth.response.dto';
import { silentLogin } from 'src/main/dto/requests/auth/silent-login.dto';
import { UserSessionService } from '../user-session.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSessionRepository: UserSessionRepository,
    private readonly mailService: MailService,
    private readonly logger: LoggerService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async getUser(userId: number): Promise<User> {
    return this.userRepository.findUserById(userId);
  }
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    this.logger.log(`User attempting to login with email: ${email}`);

    const userContact = await this.userRepository.findByEmail(email);
    if (!userContact) {
      this.logger.error(`User not found with email: ${email}`);
      return AUTH_RESPONSES.USER_NOT_FOUND();
    }

    const user = await this.userRepository.findUserWithFullDetails(
      userContact.id,
    );
    if (!user) {
      this.logger.error(`User not found with email: ${email}`);
      return AUTH_RESPONSES.USER_NOT_FOUND();
    }

    if (!user.isActive) {
      this.logger.error(`User is not Active: ${email}`);
      return AUTH_RESPONSES.USER_NOT_ACTIVE();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.error(`Invalid credentials for email: ${email}`);
      return AUTH_RESPONSES.INVALID_CREDENTIALS();
    }

    user.lastLoginTime = new Date();
    await this.userRepository.save(user);

    const session = this.userSessionRepository.create({
      user,
      token: crypto.randomBytes(50).toString('hex'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.userSessionRepository.save(session);
    const sessionResposne = {
      token: session.token,
      expiresAt: session.expiresAt,
    };

    const userDetails = this.extractUserDetails(user);
    this.logger.log(`Login successful for email: ${email}`);
    return AUTH_RESPONSES.LOGIN_SUCCESS(userDetails, sessionResposne);
  }

  async handleGoogleAuth(
    googleUser: any,
  ): Promise<LoginResponseDto | FailureResposneDto> {
    const { email } = googleUser;

    const userContact = await this.userRepository.findByEmail(email);
    if (!userContact) {
      this.logger.error(`User not found with email: ${email}`);
      return AUTH_RESPONSES.USER_NOT_FOUND();
    }

    const user = await this.userRepository.findUserWithFullDetails(
      userContact.id,
    );
    if (!user) {
      this.logger.error(`User not found with email: ${email}`);
      return AUTH_RESPONSES.USER_NOT_FOUND();
    }

    if (!user.isActive) {
      this.logger.error(`User is not Active: ${email}`);
      return AUTH_RESPONSES.USER_NOT_ACTIVE();
    }

    user.lastLoginTime = new Date();
    await this.userRepository.save(user);

    const session = this.userSessionRepository.create({
      user,
      token: crypto.randomBytes(50).toString('hex'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.userSessionRepository.save(session);

    const sessionResponse = {
      token: session.token,
      expiresAt: session.expiresAt,
    };

    const userDetails = this.extractUserDetails(user);
    this.logger.log(`Google login successful for email: ${email}`);
    return AUTH_RESPONSES.LOGIN_SUCCESS(userDetails, sessionResponse);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto | FailureResposneDto> {
    this.logger.log(
      `Forgot password request for email: ${forgotPasswordDto.officialEmail}`,
    );

    const userContact = await this.userRepository.findByEmail(
      forgotPasswordDto.officialEmail,
    );

    if (!userContact) {
      this.logger.error(
        `User not found with email: ${forgotPasswordDto.officialEmail}`,
      );
      return AUTH_RESPONSES.USER_NOT_FOUND();
    }

    const user = userContact;
    user.resetToken = crypto.randomBytes(50).toString('hex').slice(0, 100);
    user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await this.userRepository.save(user);

    await this.sendPasswordResetEmail(user, userContact.officialEmail);

    this.logger.log(
      `Password reset email sent successfully to ${forgotPasswordDto.officialEmail}`,
    );
    return AUTH_RESPONSES.FORGOT_PASSWORD_EMAIL_SENT();
  }

  async changePassword(
    reset_token: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto | FailureResposneDto> {
    this.logger.log(`Change password request with reset token: ${reset_token}`);

    const user = await this.userRepository.findUserByResetToken(reset_token);
    if (!user) {
      this.logger.error(`User not found with reset token: ${reset_token}`);
      return AUTH_RESPONSES.CHANGE_PASSWORD_USER_NOT_FOUND();
    }

    if (user.resetTokenExpires < new Date()) {
      this.logger.error(
        `Reset token expired for user with reset token: ${reset_token}`,
      );
      return AUTH_RESPONSES.CHANGE_PASSWORD_TOKEN_EXPIRED();
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = '';
    user.resetTokenExpires = null;

    await this.userRepository.save(user);

    this.logger.log(
      `Password has been reset successfully for user with reset token: ${reset_token}`,
    );
    return AUTH_RESPONSES.CHANGE_PASSWORD_SUCCESS();
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto | FailureResposneDto> {
    this.logger.log(
      `Reset password request for user ID: ${resetPasswordDto.userId}`,
    );

    const user = await this.userRepository.findUserWithCredentials(
      resetPasswordDto.userId,
    );
    if (!user) {
      this.logger.error(`User not found with ID: ${resetPasswordDto.userId}`);
      return AUTH_RESPONSES.RESET_PASSWORD_USER_NOT_FOUND();
    }

    if (!user.isActive) {
      this.logger.error(
        `User account is inactive for user ID: ${resetPasswordDto.userId}`,
      );
      return AUTH_RESPONSES.RESET_PASSWORD_USER_NOT_FOUND();
    }

    const isOldPasswordValid = await bcrypt.compare(
      resetPasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      this.logger.error(
        `Invalid old password for user ID: ${resetPasswordDto.userId}`,
      );
      return AUTH_RESPONSES.RESET_PASSWORD_INVALID_OLD_PASSWORD();
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userSessionRepository.deletebyUserId(user.id);

    this.logger.log(
      `Password reset successfully for user ID: ${resetPasswordDto.userId}`,
    );
    return AUTH_RESPONSES.RESET_PASSWORD_SUCCESS();
  }

  async generatePassword(
    generatePasswordDto: GeneratePasswordDto,
  ): Promise<GeneratePasswordResponseDto | FailureResposneDto> {
    try {
      const {
        user: { id },
      } = generatePasswordDto;

      const user = await this.userRepository.findUserById(id);
      if (!user) {
        this.logger.error(`User not found with ID: ${id}`);
        return AUTH_RESPONSES.USER_WITH_ID_NOT_FOUND(id);
      }

      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await this.userRepository.save(user);

      const loginLink = `${authConstants.domain}/${authConstants.endpoints.login}`;
      const subject = mailSubject.auth.newPassword;
      const template = mailTemplates.auth.newPassword;

      const context = {
        name: `${user.firstName} ${user.lastName}`,
        username: user.officialEmail,
        password: newPassword,
        link: loginLink,
      };

      await this.mailService.sendMail(
        user.officialEmail,
        subject,
        template,
        context,
      );

      this.logger.log(`New password generated and sent to user ${id}`);
      return AUTH_RESPONSES.GENERATE_PASSWORD_SUCCESS();
    } catch (error) {
      this.logger.error(`Failed to generate password: ${error.message}`);
      throw error;
    }
  }

  async validateUser(userId: number, accessToken: string): Promise<boolean> {
    this.logger.log(
      `Validating user with ID: ${userId} and access token: ${accessToken}`,
    );

    try {
      const session = await this.userSessionRepository.findValidSession(
        userId,
        accessToken,
      );
      if (!session || session.expiresAt < new Date()) {
        this.logger.warn(`Invalid or expired session for user ID: ${userId}`);
        return false;
      }

      const user = await this.userRepository.findUserById(userId);
      if (!user?.isActive) {
        this.logger.warn(`Invalid or inactive user with ID: ${userId}`);
        return false;
      }

      this.logger.log(`User validated successfully with ID: ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Validation failed for user ID: ${userId} with error: ${error.message}`,
      );
      return false;
    }
  }

  async silentLogin(loginDetails: silentLogin): Promise<LoginResponseDto> {
    try {
      const session = await this.validateSession(
        loginDetails.userID,
        loginDetails.sessionId,
      );
      if (session) {
        if (
          await this.userSessionService.getUserSessionById(
            loginDetails.sessionId,
          )
        ) {
          const sessionDetails =
            await this.userSessionService.getUserSessionDetails(
              loginDetails.sessionId,
            );
          const sessionResposne = {
            token: sessionDetails.token,
            expiresAt: sessionDetails.expiresAt,
          };
          return AUTH_RESPONSES.LOGIN_SUCCESS(
            this.extractUserDetails(
              await this.userRepository.findUserById(loginDetails.userID),
            ),
            sessionResposne,
          );
        }
      }
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }

  async validateSession(userId: number, accessToken: string): Promise<boolean> {
    if (!userId || !accessToken) {
      throw new UnauthorizedException(
        'Please provide a valid user ID and access token',
      );
    }

    const isValid = await this.validateUser(Number(userId), accessToken);

    if (!isValid) {
      throw new UnauthorizedException(
        'The provided user ID or access token is invalid',
      );
    }
    return true;
  }

  async logout(
    userId: number,
    token: string,
  ): Promise<LogoutResponseDto | FailureResposneDto> {
    this.logger.log(
      `Logout request for user ID: ${userId} with token: ${token}`,
    );

    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        this.logger.error(`User not found with ID: ${userId}`);
        return AUTH_RESPONSES.USER_WITH_ID_NOT_FOUND(userId);
      }

      const session = await this.userSessionRepository.findActiveSession(
        userId,
        token,
      );
      if (!session) {
        this.logger.error(
          `Invalid or expired session for user ID: ${userId} with token: ${token}`,
        );
        return AUTH_RESPONSES.INVALID_SESSION(userId, token);
      }

      await this.userSessionRepository.deleteByToken(token);

      this.logger.log(
        `Logout successful for user ID: ${userId} with token: ${token}`,
      );
      return AUTH_RESPONSES.LOGOUT_SUCCESS(userId);
    } catch (error) {
      this.logger.error(
        `Logout failed for user ID: ${userId} with token: ${token} with error: ${error.message}`,
      );
      return error;
    }
  }

  private async sendPasswordResetEmail(
    user: User,
    offcialEmail: string,
  ): Promise<void> {
    const resetLink = `${authConstants.domain}/${authConstants.endpoints.forgotPassword}?resetToken=${user.resetToken}`;
    const subject = mailSubject.auth.forgotPassword;
    const template = mailTemplates.auth.forgotPassword;
    const context = {
      offcialEmail: user.officialEmail,
      link: resetLink,
    };

    await this.mailService.sendMail(offcialEmail, subject, template, context);
  }

  private extractUserDetails(user: User): Partial<User> {
    return {
      id: user.id,
      role: {
        id: user.role.id,
        roleName: user.role.roleName,
        roleDescription: '',
      } as Role,
      firstName: user.firstName,
      lastName: user.lastName,
      officialEmail: user.officialEmail,
      primaryPhone: user.primaryPhone,
      trlId: user.trlId,
      imageURL: user.imageURL,
      isActive: user.isActive,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
