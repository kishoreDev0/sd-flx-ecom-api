
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFaqDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  question: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  answer: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  updatedBy: number;
}