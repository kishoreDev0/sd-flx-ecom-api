import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  categoryName: string;

  @ApiProperty({ required: false })
  description?: string;

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
