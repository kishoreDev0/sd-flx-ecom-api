import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';

export class UserRoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  roleName: string;
}
export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  updatedBy: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  imageURL: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  resetToken: string;

  @ApiProperty()
  resetTokenExpires: Date;

  @ApiProperty()
  lastLoginTime: Date;

  @ApiProperty({ type: () => UserRoleResponseDto })
  role: UserRoleResponseDto;
}

export type UserResponseWrapper = GenericResponseDto<UserResponseDto>;

export type UsersResponseWrapper = GenericResponseDto<UserResponseDto[]>;
