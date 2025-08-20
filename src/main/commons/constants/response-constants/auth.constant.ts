import { HttpStatus } from '@nestjs/common';
import {
  LoginResponseDto,
  LoginDto,
  ForgotPasswordResponseDto,
  ChangePasswordResponseDto,
  ResetPasswordResponseDto,
  GeneratePasswordResponseDto,
  LogoutResponseDto,
} from 'src/main/dto/responses/auth.response.dto';
import { InviteUserResponseDto } from 'src/main/dto/responses/invite-response.dto';
import { User } from 'src/main/entities/user.entity';

export const AUTH_RESPONSES = {
  EMAIL_EXISTS: {
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: 'Email already exists',
  },

  CONTACT_EXISTS: {
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: 'Contact already exists',
  },

  INVALID_REQUEST: {
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: 'Official email is required',
  },

  CONTACT_REQUIRED: {
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: 'Contact is required',
  },
  INVITE_SUCCESS: (
    sendInviteUserObject: InviteUserResponseDto,
  ): {
    success: boolean;
    message: string;
    data: InviteUserResponseDto;
    statusCode: HttpStatus;
  } => ({
    success: true,
    message: 'Invite sent successfully',
    data: sendInviteUserObject,
    statusCode: HttpStatus.CREATED,
  }),
  LOGIN_SUCCESS: (
    userDetails: User | Partial<User>,
    session: {
      token: string;
      expiresAt: Date;
    },
  ): LoginResponseDto => ({
    success: true,
    message: 'Login successful',
    data: {
      user: userDetails,
      session: session,
    } as LoginDto,
    statusCode: HttpStatus.OK,
  }),

  USER_WITH_ID_NOT_FOUND: (userId: number): LoginResponseDto => ({
    success: false,
    message: `User with ID ${userId} not found`,
    data: null,
    statusCode: HttpStatus.NOT_FOUND,
  }),
  USER_NOT_FOUND: (): LoginResponseDto => ({
    success: false,
    message: `User not found`,
    data: null,
    statusCode: HttpStatus.NOT_FOUND,
  }),
  USER_NOT_ACTIVE: (): LoginResponseDto => ({
    success: false,
    message: 'User account is not active',
    data: null,
    statusCode: HttpStatus.FORBIDDEN,
  }),

  INVALID_CREDENTIALS: (): LoginResponseDto => ({
    success: false,
    message: 'Invalid credentials',
    data: null,
    statusCode: HttpStatus.UNAUTHORIZED,
  }),

  FORGOT_PASSWORD_EMAIL_SENT: (): ForgotPasswordResponseDto => ({
    success: true,
    message: 'Password reset instructions have been sent to your email',
    data: null,
    statusCode: HttpStatus.OK,
  }),

  FORGOT_PASSWORD_USER_NOT_FOUND: (): ForgotPasswordResponseDto => ({
    success: false,
    message: 'No user found with this email address',
    data: null,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  CHANGE_PASSWORD_SUCCESS: (): ChangePasswordResponseDto => ({
    success: true,
    message: 'Password has been changed successfully',
    data: { success: true },
    statusCode: HttpStatus.OK,
  }),

  CHANGE_PASSWORD_TOKEN_EXPIRED: (): ChangePasswordResponseDto => ({
    success: false,
    message: 'Password reset token has expired',
    data: null,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  CHANGE_PASSWORD_USER_NOT_FOUND: (): ChangePasswordResponseDto => ({
    success: false,
    message: 'Invalid reset token',
    data: null,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  RESET_PASSWORD_SUCCESS: (): ResetPasswordResponseDto => ({
    success: true,
    message: 'Password has been reset successfully',
    data: { success: true },
    statusCode: HttpStatus.OK,
  }),

  RESET_PASSWORD_USER_NOT_FOUND: (): ResetPasswordResponseDto => ({
    success: false,
    message: 'User not found',
    data: null,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  RESET_PASSWORD_USER_NOT_ACTIVE: (): ResetPasswordResponseDto => ({
    success: false,
    message: 'User account is not active',
    data: null,
    statusCode: HttpStatus.FORBIDDEN,
  }),

  RESET_PASSWORD_INVALID_OLD_PASSWORD: (): ResetPasswordResponseDto => ({
    success: false,
    message: 'Invalid old password',
    data: null,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  GENERATE_PASSWORD_SUCCESS: (): GeneratePasswordResponseDto => ({
    success: true,
    message: 'New password generated and sent successfully',
    data: null,
    statusCode: HttpStatus.OK,
  }),

  GENERATE_PASSWORD_FAILURE: (
    message: string,
  ): GeneratePasswordResponseDto => ({
    success: false,
    message: message,
    data: null,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  LOGOUT_SUCCESS: (userId: number): LogoutResponseDto => ({
    success: true,
    message: `User ${userId} logged out successfully`,
    data: { success: true },
    statusCode: HttpStatus.OK,
  }),

  LOGOUT_USER_NOT_FOUND: (userId: number): LogoutResponseDto => ({
    success: false,
    message: `User ${userId} not found`,
    data: null,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  INVALID_SESSION: (userId: number, token: string): LogoutResponseDto => ({
    success: false,
    message: `Invalid or expired session for user ${userId} with token ${token}`,
    data: null,
    statusCode: HttpStatus.UNAUTHORIZED,
  }),
  CUSTOM_MESSAGE: (
    message: string,
    statusCode: number,
  ): {
    success: boolean;
    message: string;
    data: null;
    statusCode: HttpStatus;
  } => ({
    success: false,
    message: message,
    data: null,
    statusCode: statusCode,
  }),
};
