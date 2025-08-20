import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateWishlistDTO {

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
