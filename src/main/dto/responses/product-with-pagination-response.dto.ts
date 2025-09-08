import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductVariantAttributeDto {
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

export class ProductVariantDto {
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
    type: [ProductVariantAttributeDto],
  })
  attributes: ProductVariantAttributeDto[];

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

export class ProductDto {
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
    example: 'Latest iPhone with advanced features',
  })
  description: string;

  @ApiProperty({
    description: 'Product images',
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
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
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Product variants with different attribute combinations',
    type: [ProductVariantDto],
  })
  variants?: ProductVariantDto[];
}

export class PaginationInfo {
  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}

export class ProductsWithPaginationResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Products retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of products',
    type: [ProductDto],
  })
  data: ProductDto[];

  @ApiPropertyOptional({
    description: 'Pagination information',
    type: PaginationInfo,
  })
  pagination?: PaginationInfo;
}
