import { IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandCategoryDto {
  @ApiProperty({
    description: 'Brand ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  brandId: number;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Whether this is the primary category for the brand',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for displaying categories',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether the mapping is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
