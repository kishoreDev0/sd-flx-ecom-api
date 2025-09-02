import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenericResponseDto } from '../generics/generic-response.dto';

export class AttributeValueResponseDto {
  @ApiProperty({
    description: 'Attribute value ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The actual value (e.g., Red, XL, Cotton)',
    example: 'Red',
  })
  value: string;

  @ApiProperty({
    description: 'Display name for the value',
    example: 'Crimson Red',
  })
  displayName: string;

  @ApiPropertyOptional({
    description: 'Description of the attribute value',
    example: 'Deep crimson red color',
  })
  description?: string;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Whether the attribute value is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'User who created the attribute value',
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
    description: 'User who last updated the attribute value',
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
}

export class AttributeResponseDto {
  @ApiProperty({
    description: 'Attribute ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Attribute name (e.g., Color, Size, Material)',
    example: 'Color',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Attribute description',
    example: 'Product color variations',
  })
  description?: string;

  @ApiProperty({
    description: 'Type of attribute',
    example: 'select',
    enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
  })
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';

  @ApiProperty({
    description: 'Whether the attribute is required for products',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'Whether the attribute is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'List of attribute values',
    type: [AttributeValueResponseDto],
  })
  values: AttributeValueResponseDto[];

  @ApiPropertyOptional({
    description: 'User who created the attribute',
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
    description: 'User who last updated the attribute',
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
}

// Response wrapper classes following the same pattern as other modules
export class AttributeResponseWrapper extends GenericResponseDto<AttributeResponseDto> {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Attribute created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Attribute data',
    type: AttributeResponseDto,
  })
  data: AttributeResponseDto;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;
}

export class AttributesResponseWrapper extends GenericResponseDto<AttributeResponseDto[]> {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Attributes retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of attributes',
    type: [AttributeResponseDto],
  })
  data: AttributeResponseDto[];

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}
