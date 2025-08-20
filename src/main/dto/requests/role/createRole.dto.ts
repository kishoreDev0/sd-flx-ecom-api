import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidId } from 'src/main/commons/guards/is-valid-id.decorator';
import { User } from 'src/main/entities/user.entity';

export class CreateRoleDTO {
  @ApiProperty({ example: 'SUPER_USER', description: 'The name of the role' })
  @IsString()
  @IsNotEmpty({ message: 'role_name is required' })
  roleName: string;

  @ApiProperty({
    example: 'Administrator role with full access',
    description: 'A brief description of the role',
    required: false,
  })
  @IsString()
  @IsOptional()
  roleDescription?: string;

  @ApiProperty({
    example: { id: 1 },
    description: 'The user creating this role, must be a valid user object',
  })
  @IsNotEmpty({ message: 'createdBy is required' })
  @IsValidId({
    message: 'createdBy must be an object with a valid id where (id >= 1)',
  })
  createdBy: User;
}
