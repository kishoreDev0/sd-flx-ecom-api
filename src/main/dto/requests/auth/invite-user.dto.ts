import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/main/entities/role.entity';
import { User } from 'src/main/entities/user.entity';

export class InviteUserRequestDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email is required' })
  officialEmail: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'primary Phone number is required' })
  primaryPhone: string;

  @ApiProperty({
    example: { id: 1 },
  })
  @IsNotEmpty({ message: 'roleID is required' })
  roleId: Role;

  @ApiProperty({
    example: { id: 1 },
  })
  @IsNotEmpty({ message: 'created_by is required' })
  createdBy: User;
}
