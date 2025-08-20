import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCartDTO {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  productIds: number[];

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}
