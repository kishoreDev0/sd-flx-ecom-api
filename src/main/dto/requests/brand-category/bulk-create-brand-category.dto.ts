import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBrandCategoryDto } from './create-brand-category.dto';

export class BulkCreateBrandCategoryDto {
  @ApiProperty({
    description: 'Brand ID',
    example: 1,
  })
  brandId: number;

  @ApiProperty({
    description: 'Array of category mappings',
    type: [CreateBrandCategoryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBrandCategoryDto)
  categories: CreateBrandCategoryDto[];
}
