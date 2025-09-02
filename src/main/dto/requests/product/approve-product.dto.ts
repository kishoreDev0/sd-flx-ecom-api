import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveProductDto {
  @ApiProperty({
    description: 'User ID who is approving the product',
    example: 1,
  })
  @IsNumber()
  approvedBy: number;
}

export class RejectProductDto {
  @ApiProperty({
    description: 'User ID who is rejecting the product',
    example: 1,
  })
  @IsNumber()
  rejectedBy: number;

  @ApiPropertyOptional({
    description: 'Reason for rejection',
    example: 'Product images are not clear enough',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

