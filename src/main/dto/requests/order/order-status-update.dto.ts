import { IsNotEmpty, IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../../entities/order.entity';

export class OrderStatusUpdateDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  carrier?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  estimatedDeliveryDate?: string;

  @ApiProperty()
  @IsNumber()
  updatedById: number;
}
