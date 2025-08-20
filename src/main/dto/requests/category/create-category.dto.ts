import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}