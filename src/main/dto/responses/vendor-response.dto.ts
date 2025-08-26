import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VendorDto {
  @ApiProperty({
    description: 'Vendor ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Vendor name',
    example: 'John Doe',
  })
  vendorName: string;

  @ApiPropertyOptional({
    description: 'Business name',
    example: 'Doe Enterprises',
  })
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Business address',
    example: '123 Business St, City, State 12345',
  })
  businessAddress?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Tax ID',
    example: 'TAX123456789',
  })
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Business license',
    example: 'LIC123456789',
  })
  businessLicense?: string;

  @ApiProperty({
    description: 'Commission rate',
    example: 10.5,
  })
  commissionRate: number;

  @ApiProperty({
    description: 'Verification status',
    example: false,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Active status',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Verification date',
    example: '2024-01-01T00:00:00.000Z',
  })
  verificationDate?: Date;

  @ApiPropertyOptional({
    description: 'Verification notes',
    example: 'Documents verified successfully',
  })
  verificationNotes?: string;

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
    description: 'Associated user ID',
    example: 1,
  })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Number of brands',
    example: 5,
  })
  brandCount?: number;

  @ApiPropertyOptional({
    description: 'Number of products',
    example: 25,
  })
  productCount?: number;
}

export class VendorResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Vendor created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Vendor data',
    type: VendorDto,
  })
  data: VendorDto;
}

export class VendorsResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Vendors retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'List of vendors',
    type: [VendorDto],
  })
  data: VendorDto[];
}
