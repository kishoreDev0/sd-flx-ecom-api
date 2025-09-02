import { IsString, IsNotEmpty, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttributeValueDto {
  @ApiProperty({
    description: 'Value of the attribute (e.g., Red, Blue, Green)',
    example: 'Red',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'Display name for the value (optional, defaults to value)',
    example: 'Crimson Red',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  displayName?: string;
}

export class CreateAttributeWithValuesDto {
  @ApiProperty({
    description: 'Name of the attribute (e.g., Color, Size, Material)',
    example: 'Color',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the attribute',
    example: 'Product color variations',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of attribute (text, number, select, etc.)',
    example: 'select',
    required: false,
    default: 'select',
  })
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Whether the attribute is required for products',
    example: true,
    required: false,
    default: true,
  })
  isRequired?: boolean;

  @ApiProperty({
    description: 'Whether the attribute is searchable',
    example: true,
    required: false,
    default: true,
  })
  isSearchable?: boolean;

  @ApiProperty({
    description: 'Whether the attribute is filterable',
    example: true,
    required: false,
    default: true,
  })
  isFilterable?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
    required: false,
    default: 0,
  })
  sortOrder?: number;

  @ApiProperty({
    description: 'Array of attribute values',
    type: [AttributeValueDto],
    example: [
      { value: 'Red', displayName: 'Crimson Red' },
      { value: 'Blue', displayName: 'Ocean Blue' },
      { value: 'Green', displayName: 'Forest Green' }
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttributeValueDto)
  values: AttributeValueDto[];
}
