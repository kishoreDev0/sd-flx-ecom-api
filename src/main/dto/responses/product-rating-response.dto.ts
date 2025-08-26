import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductRatingDto {
  @ApiProperty({
    description: 'Rating ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'Rating value',
    example: 4.5,
  })
  rating: number;

  @ApiPropertyOptional({
    description: 'Review title',
    example: 'Great product, highly recommended!',
  })
  reviewTitle?: string;

  @ApiPropertyOptional({
    description: 'Review content',
    example: 'This product exceeded my expectations...',
  })
  reviewContent?: string;

  @ApiProperty({
    description: 'Whether this is from a verified purchase',
    example: true,
  })
  isVerifiedPurchase: boolean;

  @ApiProperty({
    description: 'Number of helpful votes',
    example: 5,
  })
  isHelpful: number;

  @ApiProperty({
    description: 'Whether the rating is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the review is approved',
    example: false,
  })
  isApproved: boolean;

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

  @ApiPropertyOptional({
    description: 'User information',
  })
  user?: any;

  @ApiPropertyOptional({
    description: 'Product information',
  })
  product?: any;
}

export class ProductRatingStatsDto {
  @ApiProperty({
    description: 'Average rating',
    example: 4.2,
  })
  averageRating: number;

  @ApiProperty({
    description: 'Total number of ratings',
    example: 150,
  })
  totalRatings: number;

  @ApiProperty({
    description: 'Number of verified purchases',
    example: 120,
  })
  verifiedPurchases: number;

  @ApiProperty({
    description: 'Rating distribution',
    example: {
      '1': 5,
      '2': 10,
      '3': 25,
      '4': 60,
      '5': 50,
    },
  })
  ratingDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Number of approved reviews',
    example: 140,
  })
  approvedReviews: number;

  @ApiProperty({
    description: 'Number of pending reviews',
    example: 10,
  })
  pendingReviews: number;
}

export class ProductRatingResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Product rating created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Product rating data',
    type: ProductRatingDto,
  })
  data: ProductRatingDto;
}

export class ProductRatingsResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Product ratings retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of product ratings',
    type: [ProductRatingDto],
  })
  data: ProductRatingDto[];
}

export class ProductRatingStatsResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Product rating statistics retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Product rating statistics',
    type: ProductRatingStatsDto,
  })
  data: ProductRatingStatsDto;
}
