import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  categoryName: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  seoTitle?: string;

  @ApiProperty({ required: false })
  seoDescription?: string;

  @ApiProperty({ required: false, type: [String] })
  seoKeywords?: string[];

  @ApiProperty({ required: false, type: [Object] })
  subcategories?: {
    id: number;
    subcategoryName: string;
    description?: string;
    isActive: boolean;
  }[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdBy: number;

  @ApiProperty({ required: false })
  updatedBy?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
