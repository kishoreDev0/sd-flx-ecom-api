import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttributeDto {
  @ApiProperty({
    description: 'Attribute name (e.g., Color, Size, Material)',
    example: 'Color',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Attribute description',
    example: 'Product color options',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Attribute type',
    enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
    example: 'select',
  })
  @IsEnum(['text', 'number', 'boolean', 'select', 'multiselect'])
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';

  @ApiPropertyOptional({
    description: 'Whether this attribute is required for products',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'User ID who created the attribute',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
