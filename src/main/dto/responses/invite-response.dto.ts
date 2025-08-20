import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/main/entities/user.entity';
import { GenericResponseDto } from './generics/generic-response.dto';

export class UserRoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  roleName: string;
}

export class InviteUserResponseDto {
  @ApiProperty({ type: () => [UserDetailsResponseDTO] })
  userDetails: UserDetailsResponseDTO;
}

export class UserDetailsResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  officialEmail: string;

  @ApiProperty()
  primaryPhone: string;

  @ApiProperty({ type: User })
  createdBy: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: User })
  updatedBy: User;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserRoleResponseDto })
  role: UserRoleResponseDto;
}

export type InviteUserResponseWrapper =
  | GenericResponseDto<InviteUserResponseDto>
  | GenericResponseDto<null>;
