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
        name: 'Black Large T-Shirt',
        price: 29.99,
        stock: 50,
        barcode: '1234567890123',
        weight: 500,
        dimensions: '30x20x15',
        variantImages: ['https://example.com/tshirt-black-l-1.jpg', 'https://example.com/tshirt-black-l-2.jpg'],
        isActive: true,
        sortOrder: 1,
        attributes: [
          { attributeId: 1, attributeValueId: 2 }, // Color: Black
          { attributeId: 2, attributeValueId: 4 }  // Size: Large
        ]
      },
      {
        sku: 'TSHIRT-BLACK-XL',
        name: 'Black XL T-Shirt',
        price: 32.99,
        stock: 30,
        barcode: '1234567890124',
        weight: 550,
        dimensions: '32x22x16',
        variantImages: ['https://example.com/tshirt-black-xl-1.jpg'],
        isActive: true,
        sortOrder: 2,
        attributes: [
          { attributeId: 1, attributeValueId: 2 }, // Color: Black
          { attributeId: 2, attributeValueId: 5 }  // Size: XL
        ]
      },
      {
        sku: 'TSHIRT-RED-L',
        name: 'Red Large T-Shirt',
        price: 29.99,
        stock: 25,
        barcode: '1234567890125',
        weight: 500,
        dimensions: '30x20x15',
        variantImages: ['https://example.com/tshirt-red-l-1.jpg'],
        isActive: true,
        sortOrder: 3,
        attributes: [
          { attributeId: 1, attributeValueId: 1 }, // Color: Red
          { attributeId: 2, attributeValueId: 4 }  // Size: Large
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
