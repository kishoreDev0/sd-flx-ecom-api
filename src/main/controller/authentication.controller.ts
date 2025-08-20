import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  HttpException,
  Logger,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from 'src/main/service/auth/authentication.service';
import { LoginDto } from 'src/main/dto/requests/auth/login.dto';
import { ForgotPasswordDto } from 'src/main/dto/requests/auth/forgotPassword.dto';
import { ResetPasswordDto } from 'src/main/dto/requests/auth/resetPassword.dto';
import { ChangePasswordDto } from 'src/main/dto/requests/auth/recoverPassword.dto';
import { ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../commons/guards/auth.guard';
import { InviteService } from '../service/auth/invite.service';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { GeneratePasswordDto } from '../dto/requests/auth/generate-password.dto';
import { CommonUtilService } from '../utils/common.util';
import { USER_RESPONSES } from '../commons/constants/response-constants/user.constant';
import {
  ChangePasswordResponseDto,
  FailureResposneDto,
  ForgotPasswordResponseDto,
  GeneratePasswordResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  ResetPasswordResponseDto,
} from 'src/main/dto/responses/auth.response.dto';
import { InviteUserResponseWrapper } from '../dto/responses/invite-response.dto';
import { InviteUserRequestDto } from '../dto/requests/auth/invite-user.dto';
import { UserResponseWrapper } from '../dto/responses/user-response.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { GoogleService } from '../google-sign-in/google.service';

@ApiTags('Authentication')
@Controller('v1/authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly inviteService: InviteService,
    private readonly commonUtilService: CommonUtilService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('inviteUsers')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Invite a new user' })
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async inviteUser(
    @Body() inviteUserDto: InviteUserRequestDto,
    @Req() req: Request,
  ): Promise<
    | InviteUserResponseWrapper
    | FailureResposneDto
    | UserResponseWrapper
    | object
  > {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isRequestedUserAdmin =
        await this.commonUtilService.isUserAdmin(userId);

      if (!isRequestedUserAdmin) {
        return USER_RESPONSES.USER_IS_NOT_AN_ADMIN();
      }

      return await this.inviteService.inviteUser(inviteUserDto);
    } catch (error) {
      this.logger.error('Failed to invite user', error.stack);
      throw new HttpException(
        'An error occurred while inviting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('inviteUser')
  async inviteUserRev(
    @Body() inviteUserDto: InviteUserRequestDto,
    @Req() req: Request,
  ): Promise<
    | InviteUserResponseWrapper
    | FailureResposneDto
    | UserResponseWrapper
    | object
  > {
    try {
      return await this.inviteService.inviteUseRev(inviteUserDto);
    } catch (error) {
      this.logger.error('Failed to invite user', error.stack);
      throw new HttpException(
        'An error occurred while inviting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      return await this.authenticationService.login(loginDto);
    } catch (error) {
      this.logger.error('Failed to login', error.stack);
      throw new HttpException(
        'An error occurred while logging in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google Auth' })
  async googleAuth() {
    return { message: 'Route is working!' };
  }

  @Get('google/redirect')
  @UseGuards(PassportAuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google redirect' })
  async googleAuthRedirect(
    @Req() req,
  ): Promise<LoginResponseDto | FailureResposneDto> {
    try {
      const googleResult = await this.googleService.googleLogin(req);

      if (typeof googleResult === 'string' || !googleResult.user) {
        throw new UnauthorizedException('No user from Google');
      }

      const result = await this.authenticationService.handleGoogleAuth(
        googleResult.user,
      );
      return result;
    } catch (error) {
      this.logger.error('Failed to authenticate with Google', error.stack);
      throw new HttpException(
        'An error occurred during Google authentication',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto | FailureResposneDto> {
    try {
      return await this.authenticationService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      this.logger.error(
        'Failed to process forgot password request',
        error.stack,
      );
      throw new HttpException(
        'An error occurred while processing forgot password request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('recoverPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recover password using reset token' })
  @ApiHeader({
    name: 'resetToken',
    required: true,
    description: 'Password Reset Token',
  })
  async recoverPassword(
    @Headers('resetToken') resetToken: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto | FailureResposneDto> {
    try {
      return await this.authenticationService.changePassword(
        resetToken,
        changePasswordDto,
      );
    } catch (error) {
      this.logger.error('Failed to recover password', error.stack);
      throw new HttpException(
        'An error occurred while recovering password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('resetPassword')
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password for authenticated user' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto | FailureResposneDto> {
    try {
      return await this.authenticationService.resetPassword(resetPasswordDto);
    } catch (error) {
      this.logger.error('Failed to reset password', error.stack);
      throw new HttpException(
        'An error occurred while resetting password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generatePassword')
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate password for user (Admin only)' })
  async generatePassword(
    @Body() generatePasswordDto: GeneratePasswordDto,
    @Req() req: Request,
  ): Promise<
    GeneratePasswordResponseDto | FailureResposneDto | UserResponseWrapper
  > {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isRequestedUserAdmin =
        await this.commonUtilService.isUserAdmin(userId);

      if (!isRequestedUserAdmin) {
        return USER_RESPONSES.USER_IS_NOT_AN_ADMIN();
      }

      return await this.authenticationService.generatePassword(
        generatePasswordDto,
      );
    } catch (error) {
      this.logger.error('Failed to generate password', error.stack);
      throw new HttpException(
        'An error occurred while generating password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async logout(
    @Headers('user-id') userId: number,
    @Headers('access-token') token: string,
  ): Promise<LogoutResponseDto | FailureResposneDto> {
    try {
      return await this.authenticationService.logout(userId, token);
    } catch (error) {
      this.logger.error('Failed to logout', error.stack);
      throw new HttpException(
        'An error occurred while logging out',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
