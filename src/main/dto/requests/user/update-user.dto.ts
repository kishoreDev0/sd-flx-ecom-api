import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'src/main/entities/role.entity';

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return typeof value === 'object' ? Number(value.id) : Number(value);
  })
  @IsNumber()
  createdBy?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return typeof value === 'object' ? Number(value.id) : Number(value);
  })
  @IsNumber()
  updatedBy?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  officialEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  primaryPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trlId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return value === 'true' || value === true;
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resetToken?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return new Date(value);
  })
  @IsOptional()
  @IsDate()
  resetTokenExpires?: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return new Date(value);
  })
  @IsOptional()
  @IsDate()
  lastLoginTime?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return typeof value === 'object' ? Number(value.id) : Number(value);
  })
  @IsNumber()
  role?: Role;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return new Date(value);
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return new Date(value);
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
