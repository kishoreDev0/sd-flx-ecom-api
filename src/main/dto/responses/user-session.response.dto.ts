import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
import { User } from 'src/main/entities/user.entity';

export class UserSessionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: User;

  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;
}
// Response type for create booking operation
export type UserSessionResponseWrapper =
  GenericResponseDto<UserSessionResponseDto>;

export type UserSessionsResponseWrapper = GenericResponseDto<
  UserSessionResponseDto[]
>;
