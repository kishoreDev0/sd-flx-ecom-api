import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
import { User } from 'src/main/entities/user.entity';

export class FaqResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  createdBy: Partial<User>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type FaqResponseWrapper = GenericResponseDto<FaqResponseDto>;
export type FaqsResponseWrapper = GenericResponseDto<FaqResponseDto[]>;