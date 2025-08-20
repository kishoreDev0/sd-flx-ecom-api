import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @ApiProperty()
  @IsNumber()
  updatedBy: number;
  
}
