import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
// import { User } from 'src/main/entities/user.entity';

export class RoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  roleName: string;

  @ApiProperty()
  roleDescription: string;

  // @ApiProperty()
  // createdBy: User;

  // @ApiProperty()
  // updatedBy: User;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export type RoleResponseWrapper = GenericResponseDto<RoleResponseDto>;

export type RolesResponseWrapper = GenericResponseDto<RoleResponseDto[]>;
