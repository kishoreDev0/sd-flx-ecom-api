import { IsString, IsOptional, IsUrl, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Brand name',
    example: 'Nike',
  })
  @IsString()
  brandName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  brandDescription?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  brandLogo?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  vendorId?: number;

  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  createdBy?: number; // Will be set automatically from authenticated user
}
