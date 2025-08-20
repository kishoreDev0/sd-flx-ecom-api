import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
