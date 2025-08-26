import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({
    description: 'Vendor name',
    example: 'John Doe',
  })
  @IsString()
  vendorName: string;

  @ApiPropertyOptional({
    description: 'Business name',
    example: 'Doe Enterprises',
  })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Business address',
    example: '123 Business St, City, State 12345',
  })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Tax ID',
    example: 'TAX123456789',
  })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Business license number',
    example: 'LIC123456789',
  })
  @IsOptional()
  @IsString()
  businessLicense?: string;

  @ApiPropertyOptional({
    description: 'Commission rate percentage',
    example: 10.5,
    default: 10.00,
  })
  @IsOptional()
  @IsNumber()
  commissionRate?: number;

  @ApiPropertyOptional({
    description: 'User ID to associate with vendor',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
