import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttributeValueDto {
  @ApiProperty({
    description: 'Attribute value (e.g., Red, XL, Cotton)',
    example: 'Red',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({
    description: 'Display name for the value',
    example: 'Space Black',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Value description',
    example: 'Deep space black color',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'ID of the attribute this value belongs to',
    example: 1,
  })
  @IsNumber()
  attributeId: number;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'User ID who created the attribute value',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
