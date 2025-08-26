import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    description: 'Product category',
  })
  category: any;

  @ApiPropertyOptional({
    description: 'Product brand',
  })
  brand?: any;

  @ApiPropertyOptional({
    description: 'Product vendor',
  })
  vendor?: any;

  @ApiProperty({
    description: 'Product features',
    type: [Number],
    example: [1, 2, 3],
  })
  features: number[];

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Total stock available',
    example: 100,
  })
  totalNoOfStock: number;

  @ApiProperty({
    description: 'Current stock available',
    example: 50,
  })
  noOfStock: number;

  @ApiProperty({
    description: 'Whether product is in stock',
    example: true,
  })
  inStock: boolean;

  @ApiProperty({
    description: 'Created by user',
  })
  createdBy: any;

  @ApiProperty({
    description: 'Updated by user',
  })
  updatedBy: any;

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
