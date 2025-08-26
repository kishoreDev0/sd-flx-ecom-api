import { IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductRatingDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @ApiProperty({
    description: 'Rating value (1.0 to 5.0)',
    example: 4.5,
    minimum: 1.0,
    maximum: 5.0,
  })
  @IsNumber()
  @Min(1.0)
  @Max(5.0)
  @Type(() => Number)
  rating: number;

  @ApiPropertyOptional({
    description: 'Review title',
    example: 'Great product, highly recommended!',
  })
  @IsOptional()
  @IsString()
  reviewTitle?: string;

  @ApiPropertyOptional({
    description: 'Detailed review content',
    example: 'This product exceeded my expectations. The quality is excellent and it works perfectly.',
  })
  @IsOptional()
  @IsString()
  reviewContent?: string;

  @ApiPropertyOptional({
    description: 'Whether this is from a verified purchase',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerifiedPurchase?: boolean;
}
