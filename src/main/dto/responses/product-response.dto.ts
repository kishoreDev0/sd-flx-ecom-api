import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductVariantAttributeResponseDto {
  @ApiProperty({
    description: 'Attribute mapping ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Attribute information',
    example: {
      id: 1,
      name: 'Color',
      type: 'select'
    }
  })
  attribute: {
    id: number;
    name: string;
    type: string;
  };

  @ApiProperty({
    description: 'Attribute value information',
    example: {
      id: 2,
      value: 'Red',
      displayName: 'Crimson Red'
    }
  })
  attributeValue: {
    id: number;
    value: string;
    displayName: string;
  };
}

export class ProductVariantResponseDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Unique SKU for the variant',
    example: 'TSHIRT-RED-L',
  })
  sku: string;

  @ApiPropertyOptional({
    description: 'Variant name',
    example: 'Red Large T-Shirt',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific price (overrides product price)',
    example: 29.99,
  })
  price?: number;

  @ApiProperty({
    description: 'Available stock for this variant',
    example: 50,
  })
  stock: number;

  @ApiPropertyOptional({
    description: 'Variant barcode',
    example: '1234567890123',
  })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Variant weight in grams',
    example: 500,
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Variant dimensions (LxWxH in cm)',
    example: '30x20x15',
  })
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific images (JSON string)',
    example: '["https://example.com/variant1.jpg"]',
  })
  variantImages?: string;

  @ApiProperty({
    description: 'Whether this variant is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Variant attributes',
    type: [ProductVariantAttributeResponseDto],
  })
  attributes: ProductVariantAttributeResponseDto[];

  @ApiProperty({
    description: 'Variant creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Variant last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced features and titanium design',
  })
  description: string;

  @ApiProperty({
    description: 'Product images',
    type: [String],
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  })
  imagesPath: string[];

  @ApiProperty({
    description: 'Product category information',
    example: {
      id: 1,
      categoryName: 'Electronics',
      description: 'Electronic devices and gadgets'
    }
  })
  category: {
    id: number;
    categoryName: string;
    description?: string;
  };

  @ApiPropertyOptional({
    description: 'Product brand information',
    example: {
      id: 1,
      brandName: 'Apple',
      description: 'Premium technology brand'
    }
  })
  brand?: {
    id: number;
    brandName: string;
    description?: string;
  };

  @ApiPropertyOptional({
    description: 'Product vendor information',
    example: {
      id: 1,
      vendorName: 'Apple Store',
      businessName: 'Apple Inc.',
      isVerified: true
    }
  })
  vendor?: {
    id: number;
    vendorName: string;
    businessName: string;
    isVerified: boolean;
  };

  @ApiProperty({
    description: 'Product features with details',
    type: [Object],
    example: [
      { id: 1, name: 'Water Resistant' },
      { id: 2, name: 'Bluetooth Enabled' }
    ],
  })
  features: Array<{
    id: number;
    name: string;
  }>;

  @ApiProperty({
    description: 'Product price in base currency',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Total stock quantity available',
    example: 100,
  })
  totalNoOfStock: number;

  @ApiProperty({
    description: 'Current available stock quantity',
    example: 50,
  })
  noOfStock: number;

  @ApiProperty({
    description: 'Whether the product is currently in stock',
    example: true,
  })
  inStock: boolean;

  @ApiProperty({
    description: 'Whether the product has been approved by admin',
    example: false,
  })
  isApproved: boolean;

  @ApiPropertyOptional({
    description: 'User who approved the product',
    example: {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com'
    }
  })
  approvedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiPropertyOptional({
    description: 'Date when the product was approved',
    example: '2024-01-01T00:00:00.000Z',
  })
  approvedAt?: Date;

  @ApiProperty({
    description: 'User who created the product',
    example: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  })
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiPropertyOptional({
    description: 'User who last updated the product',
    example: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  })
  updatedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Product variants with different attribute combinations',
    type: [ProductVariantResponseDto],
  })
  variants?: ProductVariantResponseDto[];
}

export type ProductResponseWrapper = {
  success: boolean;
  message: string;
  data: ProductResponseDto;
  statusCode?: number;
};

export type ProductsResponseWrapper = {
  success: boolean;
  message: string;
  data: ProductResponseDto[];
  statusCode?: number;
};

// Frontend-friendly variant response DTOs
export class FrontendVariantAttributeValueDto {
  @ApiProperty({
    description: 'Attribute value ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Attribute value name',
    example: 'red',
  })
  name: string;

  @ApiProperty({
    description: 'Display name for the attribute value',
    example: 'Crimson Red',
  })
  displayName: string;
}

export class FrontendVariantAttributeDto {
  @ApiProperty({
    description: 'Attribute value ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Attribute value name',
    example: 'red',
  })
  name: string;

  @ApiProperty({
    description: 'Display name for the attribute value',
    example: 'Crimson Red',
  })
  displayName: string;
}

export class FrontendVariantDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Unique SKU for the variant',
    example: 'TSHIRT-RED-L',
  })
  sku: string;

  @ApiPropertyOptional({
    description: 'Variant name',
    example: 'Red Large T-Shirt',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific price',
    example: 29.99,
  })
  price?: number;

  @ApiProperty({
    description: 'Available stock for this variant',
    example: 50,
  })
  stock: number;

  @ApiPropertyOptional({
    description: 'Variant barcode',
    example: '1234567890123',
  })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Variant weight in grams',
    example: 500,
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Variant dimensions (LxWxH in cm)',
    example: '30x20x15',
  })
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific images (JSON string)',
    example: '["https://example.com/variant1.jpg"]',
  })
  variantImages?: string;

  @ApiProperty({
    description: 'Whether this variant is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Variant attributes as key-value pairs for easy frontend access',
    example: {
      color: { id: 1, name: 'red', displayName: 'Crimson Red' },
      size: { id: 2, name: 'L', displayName: 'Large' }
    },
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'red' },
        displayName: { type: 'string', example: 'Crimson Red' }
      }
    }
  })
  attributes: Record<string, FrontendVariantAttributeDto>;

  @ApiProperty({
    description: 'Variant creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Variant last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class FrontendVariantsResponseDto {
  @ApiProperty({
    description: 'Grouped attributes for easy frontend iteration',
    example: {
      size: [
        { id: 1, name: 'XL', displayName: 'Extra Large' },
        { id: 2, name: 'L', displayName: 'Large' }
      ],
      color: [
        { id: 1, name: 'red', displayName: 'Crimson Red' },
        { id: 2, name: 'blue', displayName: 'Ocean Blue' }
      ]
    },
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'red' },
          displayName: { type: 'string', example: 'Crimson Red' }
        }
      }
    }
  })
  attributeGroups: Record<string, FrontendVariantAttributeValueDto[]>;

  @ApiProperty({
    description: 'Product variants with simplified attribute structure',
    type: [FrontendVariantDto],
  })
  variants: FrontendVariantDto[];
}

export class FrontendVariantsResponseWrapper {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Product variants retrieved successfully for frontend',
  })
  message: string;

  @ApiProperty({
    description: 'Response data containing grouped attributes and variants',
    type: FrontendVariantsResponseDto,
  })
  data: FrontendVariantsResponseDto;
}