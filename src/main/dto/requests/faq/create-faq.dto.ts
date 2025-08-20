import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  answer: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNumber()
  createdBy: number;
}