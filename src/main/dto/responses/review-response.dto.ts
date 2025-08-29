import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus, ReviewType } from '../../entities/review.entity';

export class ReviewResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false })
  productId?: number;

  @ApiProperty({ required: false })
  orderId?: number;

  @ApiProperty({ enum: ReviewType })
  reviewType: ReviewType;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: ReviewStatus })
  status: ReviewStatus;

  @ApiProperty()
  isVerifiedPurchase: boolean;

  @ApiProperty()
  isHelpful: boolean;

  @ApiProperty()
  helpfulCount: number;

  @ApiProperty()
  unhelpfulCount: number;

  @ApiProperty({ type: [String], required: false })
  images?: string[];

  @ApiProperty({ type: [String], required: false })
  tags?: string[];

  @ApiProperty({ required: false })
  adminResponse?: string;

  @ApiProperty({ required: false })
  adminResponseAt?: Date;

  @ApiProperty({ required: false })
  rejectionReason?: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty({ required: false })
  editedAt?: Date;

  @ApiProperty({ required: false })
  editReason?: string;

  @ApiProperty({ required: false })
  metadata?: {
    deviceInfo?: string;
    location?: string;
    ipAddress?: string;
    userAgent?: string;
    [key: string]: any;
  };

  @ApiProperty()
  createdById: number;

  @ApiProperty({ required: false })
  updatedById?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // User details
  @ApiProperty({ required: false })
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  // Product details
  @ApiProperty({ required: false })
  product?: {
    id: number;
    name: string;
    price: number;
  };

  // Order details
  @ApiProperty({ required: false })
  order?: {
    id: number;
    orderNumber: string;
  };

  // Review responses
  @ApiProperty({ type: [Object], required: false })
  responses?: ReviewResponseResponseDto[];

  // Helpful votes
  @ApiProperty({ type: [Object], required: false })
  helpfulVotes?: ReviewHelpfulVoteResponseDto[];
}

export class ReviewResponseResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reviewId: number;

  @ApiProperty()
  responderId: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isOfficialResponse: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Responder details
  @ApiProperty({ required: false })
  responder?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class ReviewHelpfulVoteResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reviewId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  isHelpful: boolean;

  @ApiProperty()
  createdAt: Date;

  // User details
  @ApiProperty({ required: false })
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export class ReviewReportResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reviewId: number;

  @ApiProperty()
  reporterId: number;

  @ApiProperty()
  reason: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ReviewStatus })
  status: ReviewStatus;

  @ApiProperty({ required: false })
  adminNotes?: string;

  @ApiProperty({ required: false })
  resolvedById?: number;

  @ApiProperty({ required: false })
  resolvedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Reporter details
  @ApiProperty({ required: false })
  reporter?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  // Review details
  @ApiProperty({ required: false })
  review?: {
    id: number;
    title: string;
    content: string;
    rating: number;
  };
}

export class ReviewStatsDto {
  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  approvedReviews: number;

  @ApiProperty()
  pendingReviews: number;

  @ApiProperty()
  rejectedReviews: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty({ type: [Object] })
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];

  @ApiProperty({ type: [Object] })
  reviewsByType: {
    type: ReviewType;
    count: number;
    averageRating: number;
  }[];

  @ApiProperty()
  totalHelpfulVotes: number;

  @ApiProperty()
  totalReports: number;

  @ApiProperty()
  pendingReports: number;
}

export class ProductReviewStatsDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty({ type: [Object] })
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];

  @ApiProperty()
  verifiedPurchaseCount: number;

  @ApiProperty()
  helpfulReviewCount: number;

  @ApiProperty()
  recentReviewsCount: number; // Last 30 days
}
