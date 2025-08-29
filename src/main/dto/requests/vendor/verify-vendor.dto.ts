import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyVendorDto {
  @ApiPropertyOptional({
    description: 'Verification notes',
    example: 'Documents verified successfully',
  })
  @IsOptional()
  @IsString()
  verificationNotes?: string;

  @ApiPropertyOptional({
    description: 'Verification status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'KYC status',
    example: 'approved',
  })
  @IsOptional()
  @IsString()
  kycStatus?: string;
}
