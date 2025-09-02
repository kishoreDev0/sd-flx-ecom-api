import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductAttributeDto {
  @ApiProperty({
    description: 'ID of the attribute (e.g., Color, Size, Material)',
    example: 1,
  })
  @IsNumber()
  attributeId: number;

  @ApiProperty({
    description: 'ID of the attribute value (e.g., Red, XL, Cotton)',
    example: 2,
  })
  @IsNumber()
  attributeValueId: number;

  @ApiPropertyOptional({
    description: 'Custom value for text/number attributes (optional)',
    example: 'Custom text value',
  })
  @IsOptional()
  @IsString()
  customValue?: string;
}
