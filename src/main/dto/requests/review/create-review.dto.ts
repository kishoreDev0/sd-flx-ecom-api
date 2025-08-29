import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewStatus, ReviewType } from '../../../entities/review.entity';

export class CreateReviewDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  productId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  orderId?: number;

  @ApiProperty({ enum: ReviewType })
  @IsEnum(ReviewType)
  @IsNotEmpty()
  reviewType: ReviewType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isVerifiedPurchase?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsNumber()
  createdById: number;
}

export class UpdateReviewDto {
  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  editReason?: string;

  @ApiProperty()
  @IsNumber()
  updatedById: number;
}

export class CreateReviewResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isOfficialResponse?: boolean;

  @ApiProperty()
  @IsNumber()
  responderId: number;
}

export class CreateReviewHelpfulVoteDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isHelpful: boolean;

  @ApiProperty()
  @IsNumber()
  userId: number;
}

export class CreateReviewReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  reporterId: number;
}

export class ApproveReviewDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adminResponse?: string;

  @ApiProperty()
  @IsNumber()
  approvedById: number;
}

export class RejectReviewDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;

  @ApiProperty()
  @IsNumber()
  rejectedById: number;
}

export class ResolveReviewReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reportId: number;

  @ApiProperty({ enum: ReviewStatus })
  @IsEnum(ReviewStatus)
  @IsNotEmpty()
  status: ReviewStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adminNotes?: string;

  @ApiProperty()
  @IsNumber()
  resolvedById: number;
}
