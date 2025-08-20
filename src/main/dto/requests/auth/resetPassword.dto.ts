import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'oldPassword is required' })
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'newPassword is required' })
  newPassword: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
}
