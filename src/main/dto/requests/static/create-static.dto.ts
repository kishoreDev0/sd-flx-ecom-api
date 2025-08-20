// dto/requests/static/create-static.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaticDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

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
