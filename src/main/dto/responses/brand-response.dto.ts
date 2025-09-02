import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandDto {
  @ApiProperty({
    description: 'Brand ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Brand name',
    example: 'Nike',
  })
  brandName: string;

  @ApiPropertyOptional({
    description: 'Brand description',
    example: 'Just Do It - Leading sports brand',
  })
  brandDescription?: string;

  @ApiPropertyOptional({
    description: 'Brand logo URL',
    example: 'https://example.com/nike-logo.png',
  })
  brandLogo?: string;

  @ApiPropertyOptional({
    description: 'Brand website URL',
    example: 'https://www.nike.com',
  })
  websiteUrl?: string;

  @ApiProperty({
    description: 'Whether the brand is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Vendor associated with the brand',
    example: {
      id: 1,
      vendorName: 'Nike Inc',
      businessName: 'Nike Inc',
      officialEmail: 'contact@nike.com'
    }
  })
  vendor?: {
    id: number;
    vendorName: string;
    businessName: string;
    officialEmail: string;
  };

  @ApiPropertyOptional({
    description: 'Primary category associated with the brand',
    example: {
      id: 1,
      categoryName: 'Sports & Fitness',
      description: 'Sports equipment and fitness gear'
    }
  })
  primaryCategory?: {
    id: number;
    categoryName: string;
    description?: string;
  };

  @ApiPropertyOptional({
    description: 'User who created the brand',
    example: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  })
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiPropertyOptional({
    description: 'User who last updated the brand',
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
    description: 'Number of products associated with this brand',
    example: 25,
  })
  productCount?: number;
}

export class BrandResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Brand created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Brand data',
    type: BrandDto,
  })
  data: BrandDto;
}

export class BrandsResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Brands retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of brands',
    type: [BrandDto],
  })
  data: BrandDto[];
}
