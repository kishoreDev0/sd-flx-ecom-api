import { IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductByBrandsDto {
  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: 'Array of brand IDs to filter products',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  brandIds: number[];

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 10.00,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 100.00,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter by stock availability',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Sort by field (name, price, created_at)',
    example: 'price',
  })
  @IsOptional()
  sortBy?: 'name' | 'price' | 'created_at';

  @ApiPropertyOptional({
    description: 'Sort order (ASC, DESC)',
    example: 'ASC',
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
