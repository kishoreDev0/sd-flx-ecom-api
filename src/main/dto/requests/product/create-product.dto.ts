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

  @IsOptional()
  @IsArray()
  variants?: Array<{
    sku: string;
    attributes: Record<string, string>;
    price?: number;
    stock?: number;
  }>;

  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  vendorId?: number;

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
