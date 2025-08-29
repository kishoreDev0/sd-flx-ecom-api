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

  @ApiProperty({ required: false })
  parentId?: number;

  @ApiProperty({ required: false })
  parent?: CategoryResponseDto;

  @ApiProperty({ required: false, type: [CategoryResponseDto] })
  children?: CategoryResponseDto[];

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
