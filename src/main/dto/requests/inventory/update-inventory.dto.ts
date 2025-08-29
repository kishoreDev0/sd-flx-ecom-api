import { IsOptional, IsNumber, IsString, Min, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedStock?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  lowStockThreshold?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stockNotes?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  updatedById?: number;
}
