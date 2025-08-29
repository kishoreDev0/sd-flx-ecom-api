import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '../../../entities/order.entity';

export class UpdateOrderDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentTransactionId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingAddress?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vendorNotes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  adminNotes?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isReturnRequested?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  returnReason?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isEscalated?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  escalationReason?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  confirmedAt?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  shippedAt?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  deliveredAt?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  cancelledAt?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  refundedAt?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  updatedById?: number;
}