import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/main/entities/role.entity';
import { User } from 'src/main/entities/user.entity';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email is required' })
  officialEmail: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'roleID is required' })
  roleId: Role;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'isActive is required' })
  isActive: boolean;

  @IsOptional()
  @IsString()
  resetToken?: string;

  @IsOptional()
  resetTokenExpires?: Date;

  @IsOptional()
  lastLoginTime?: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'created_by is required' })
  createdBy: User;
}

export class createUserRev{

}
