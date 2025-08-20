import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/main/entities/user.entity';
import { UserSession } from 'src/main/entities/user-session.entity';
import { GenericResponseDto } from './generics/generic-response.dto';

export class LoginDto {
  @ApiProperty({ type: User })
  user: Partial<User>;

  @ApiProperty({ type: UserSession })
  session: UserSession;
}

export class ForgotPasswordDto {
  @ApiProperty()
  resetToken: string;

  @ApiProperty()
  resetTokenExpires: Date;
}

export class ChangePasswordDto {
  @ApiProperty()
  success: boolean;
}

export class ResetPasswordDto {
  @ApiProperty()
  success: boolean;
}

export class GeneratePasswordDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class LogoutDto {
  @ApiProperty()
  success: boolean;
}

export type LoginResponseDto = GenericResponseDto<LoginDto | null>;
export type FailureResposneDto = GenericResponseDto<LoginDto | null>;

export type ForgotPasswordResponseDto =
  GenericResponseDto<ForgotPasswordDto | null>;

export type ChangePasswordResponseDto =
  GenericResponseDto<ChangePasswordDto | null>;

export type ResetPasswordResponseDto =
  GenericResponseDto<ResetPasswordDto | null>;

export type GeneratePasswordResponseDto =
  GenericResponseDto<GeneratePasswordDto | null>;

export type LogoutResponseDto = GenericResponseDto<LogoutDto | null>;
