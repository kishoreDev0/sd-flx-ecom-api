import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // We'll expect images as base64 strings or image URLs (if stored externally)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imagesPath?: string[];

  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  features?: number[];

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  totalNoOfStock: number;

  @IsNumber()
  @Type(() => Number)
  noOfStock: number;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsNumber()
  @Type(() => Number)
  createdBy: number;
}
