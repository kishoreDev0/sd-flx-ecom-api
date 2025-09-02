import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubcategoryDto {
  @ApiProperty({
    description: 'Subcategory ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Subcategory name',
    example: 'Running Shoes',
  })
  subcategoryName: string;

  @ApiPropertyOptional({
    description: 'Subcategory description',
    example: 'Athletic footwear for running and jogging',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the subcategory is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Category ID this subcategory belongs to',
    example: 1,
  })
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Category details',
    example: {
      id: 1,
      categoryName: 'Sports & Fitness',
      description: 'Sports equipment and fitness gear'
    }
  })
  category?: {
    id: number;
    categoryName: string;
    description?: string;
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
}

export class SubcategoryResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Subcategory created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Subcategory data',
    type: SubcategoryDto,
  })
  data: SubcategoryDto;
}

export class SubcategoriesResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Subcategories retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of subcategories',
    type: [SubcategoryDto],
  })
  data: SubcategoryDto[];
}
