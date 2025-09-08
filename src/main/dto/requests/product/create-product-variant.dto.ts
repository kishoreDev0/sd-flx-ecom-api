import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsPositive, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductAttributeDto } from './product-attribute.dto';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Unique SKU for the variant',
    example: 'NIKE-AM90-BLACK-10',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'SKU must be at least 3 characters long' })
  @MaxLength(100, { message: 'SKU must not exceed 100 characters' })
  sku: string;

  @ApiPropertyOptional({
    description: 'Variant name (optional, will use product name if not provided)',
    example: 'Black Size 10',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific price (overrides product base price)',
    example: 129.99,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive({ message: 'Price must be a positive number' })
  price?: number;

  @ApiProperty({
    description: 'Available stock for this variant',
    example: 25,
  })
  @IsNumber()
  @Type(() => Number)
  @IsPositive({ message: 'Stock must be a positive number' })
  stock: number;

  @ApiPropertyOptional({
    description: 'Variant barcode',
    example: '1234567890123',
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Variant weight in grams',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive({ message: 'Weight must be a positive number' })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Variant dimensions (LxWxH in cm)',
    example: '30x20x15',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific images (array of image URLs)',
    example: ['https://example.com/variant1.jpg', 'https://example.com/variant2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variantImages?: string[];

  @ApiProperty({
    description: 'Attributes that define this variant (e.g., Color: Black, Size: 10)',
    type: [ProductAttributeDto],
    example: [
      { attributeId: 1, attributeValueId: 2 }, // Color: Black
      { attributeId: 2, attributeValueId: 4 }, // Size: 10
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes: ProductAttributeDto[];

  @ApiPropertyOptional({
    description: 'Whether this variant is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number;
}
