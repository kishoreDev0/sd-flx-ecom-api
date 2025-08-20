import { IsOptional, IsString, IsBoolean, IsEmail, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  queryOn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

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
