import { IsNumber, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../../entities/order-tracking.entity';

export class CreateOrderTrackingDto {
  @ApiProperty({
    description: 'Order ID',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  orderId: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Status description',
    example: 'Order has been confirmed and is being processed',
  })
  @IsOptional()
  @IsString()
  statusDescription?: string;

  @ApiPropertyOptional({
    description: 'Current location of the order',
    example: 'Warehouse A, City',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Shipping tracking number',
    example: 'TRK123456789',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Shipping carrier name',
    example: 'FedEx',
  })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Status description',
    example: 'Order shipped via FedEx',
  })
  @IsOptional()
  @IsString()
  statusDescription?: string;

  @ApiPropertyOptional({
    description: 'Current location of the order',
    example: 'Distribution Center',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Shipping tracking number',
    example: 'TRK123456789',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Shipping carrier name',
    example: 'FedEx',
  })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiPropertyOptional({
    description: 'Actual delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  actualDelivery?: string;
}

export class ShipOrderDto {
  @ApiProperty({
    description: 'Shipping tracking number',
    example: 'TRK123456789',
  })
  @IsString()
  trackingNumber: string;

  @ApiProperty({
    description: 'Shipping carrier name',
    example: 'FedEx',
  })
  @IsString()
  carrier: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;
}

export class DeliverOrderDto {
  @ApiPropertyOptional({
    description: 'Actual delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  actualDelivery?: string;
}

export class CancelOrderDto {
  @ApiProperty({
    description: 'Reason for cancellation',
    example: 'Customer request',
  })
  @IsString()
  reason: string;
}
