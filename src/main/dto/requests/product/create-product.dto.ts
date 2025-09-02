import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductAttributeDto } from './product-attribute.dto';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced features and titanium design',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Product images (URLs or base64 strings)',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagesPath?: string[];

  @ApiPropertyOptional({
    description: 'Product variants with different attribute combinations',
    type: [CreateProductVariantDto],
    example: [
      {
        sku: 'TSHIRT-BLACK-L',
        price: 29.99,
        stock: 50,
        attributes: [
          { attributeId: 1, attributeValueId: 2 }, // Color: Black
          { attributeId: 2, attributeValueId: 4 }  // Size: Large
        ]
      },
      {
        sku: 'TSHIRT-BLACK-XL',
        price: 32.99,
        stock: 30,
        attributes: [
          { attributeId: 1, attributeValueId: 2 }, // Color: Black
          { attributeId: 2, attributeValueId: 5 }  // Size: XL
        ]
      }
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @ApiProperty({
    description: 'Category ID this product belongs to',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Brand ID associated with the product',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brandId?: number;

  @ApiPropertyOptional({
    description: 'Vendor ID who created this product',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vendorId?: number;

  @ApiPropertyOptional({
    description: 'Feature IDs associated with the product (will be mapped to product_features table)',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  features?: number[];

  @ApiPropertyOptional({
    description: 'Product attributes (Color, Size, Material, etc.)',
    type: [ProductAttributeDto],
    example: [
      { attributeId: 1, attributeValueId: 2 }, // Color: Red
      { attributeId: 2, attributeValueId: 4 }, // Size: Large
      { attributeId: 3, attributeValueId: 1 }  // Material: Cotton
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes?: ProductAttributeDto[];



  @ApiProperty({
    description: 'Product price in the base currency',
    example: 999.99,
  })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Total stock quantity available',
    example: 100,
  })
  @IsNumber()
  @Type(() => Number)
  totalNoOfStock: number;

  @ApiProperty({
    description: 'Current available stock quantity',
    example: 50,
  })
  @IsNumber()
  @Type(() => Number)
  noOfStock: number;

  @ApiPropertyOptional({
    description: 'Whether the product is currently in stock',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'User ID who created the product (set automatically)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdBy?: number;
}
