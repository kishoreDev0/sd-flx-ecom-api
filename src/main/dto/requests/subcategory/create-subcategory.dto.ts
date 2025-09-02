import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'Subcategory name',
    example: 'Running Shoes',
  })
  @IsString()
  subcategoryName: string;

  @ApiPropertyOptional({
    description: 'Subcategory description',
    example: 'Athletic footwear for running and jogging',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the subcategory is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Category ID to associate with subcategory',
    example: 1,
  })
  @IsNumber()
  categoryId: number;

  @ApiPropertyOptional({
    description: 'User ID who created the subcategory',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  createdBy?: number; // Will be set automatically from authenticated user
}
