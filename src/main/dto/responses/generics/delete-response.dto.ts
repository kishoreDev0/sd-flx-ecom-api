import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generic-response.dto';

export class DeleteDto {
  @ApiProperty({ example: 1 })
  id: number;
}

export type DeleteResponseDto = GenericResponseDto<DeleteDto | null>;
