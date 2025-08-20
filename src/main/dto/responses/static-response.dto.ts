// dto/responses/static-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';

export class StaticResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdBy: number;

  @ApiProperty({ required: false })
  updatedBy?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}


export type StaticResponseWrapper = GenericResponseDto<StaticResponseDto>;

export type StaticsResponseWrapper = GenericResponseDto<StaticResponseDto[]>;