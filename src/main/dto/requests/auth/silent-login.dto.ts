import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class silentLogin {
  @ApiProperty()
  @IsNotEmpty({ message: 'session ID is required' })
  sessionId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'user ID is required' })
  userID: number;
}
