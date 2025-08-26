import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandCategoryDto {
  @ApiProperty({
    description: 'Mapping ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Brand ID',
    example: 1,
  })
  brandId: number;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Whether this is the primary category',
    example: false,
  })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Sort order',
    example: 0,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Whether the mapping is active',
    example: true,
  })
  isActive: boolean;

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
    description: 'Brand information',
  })
  brand?: any;

  @ApiPropertyOptional({
    description: 'Category information',
  })
  category?: any;
}

export class BrandCategoryResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Brand category mapping created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Brand category mapping data',
    type: BrandCategoryDto,
  })
  data: BrandCategoryDto;
}

export class BrandCategoriesResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Brand category mappings retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of brand category mappings',
    type: [BrandCategoryDto],
  })
  data: BrandCategoryDto[];
}
