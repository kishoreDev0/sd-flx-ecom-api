import { IsString, IsOptional, IsUrl, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Brand name',
    example: 'Nike',
  })
  @IsString()
  brandName: string;

  @ApiPropertyOptional({
    description: 'Brand description',
    example: 'Just Do It - Leading sports brand',
  })
  @IsOptional()
  @IsString()
  brandDescription?: string;

  @ApiPropertyOptional({
    description: 'Brand logo URL',
    example: 'https://example.com/nike-logo.png',
  })
  @IsOptional()
  @IsUrl()
  brandLogo?: string;

  @ApiPropertyOptional({
    description: 'Brand website URL',
    example: 'https://www.nike.com',
  })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether the brand is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Vendor ID to associate with brand',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  vendorId?: number;
}
