import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkImportInventoryDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: Express.Multer.File;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vendorId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsString()
  createdById: string;
}

export class BulkImportInventoryItemDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  currentStock: number;

  @ApiPropertyOptional()
  reservedStock?: number;

  @ApiPropertyOptional()
  lowStockThreshold?: number;

  @ApiPropertyOptional()
  stockNotes?: string;
}
