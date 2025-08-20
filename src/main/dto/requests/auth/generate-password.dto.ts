import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidId } from 'src/main/commons/guards/is-valid-id.decorator';
import { User } from 'src/main/entities/user.entity';

export class GeneratePasswordDto {
  @ApiProperty({ example: { id: 1 } })
  @IsNotEmpty({ message: 'user is required' })
  @IsValidId({
    message: 'user must be an object with a valid id where (id >= 1)',
  })
  user: User;
}
