import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  queryOn: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderId?: string;

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
