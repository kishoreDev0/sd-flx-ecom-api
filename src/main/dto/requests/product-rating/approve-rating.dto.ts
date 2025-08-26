import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveRatingDto {
  @ApiPropertyOptional({
    description: 'Whether to approve the rating',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional({
    description: 'Admin notes for approval/rejection',
    example: 'Review approved after content verification',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
