
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}