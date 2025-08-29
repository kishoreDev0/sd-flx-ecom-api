import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsBoolean, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod, PaymentType } from '../../../entities/payment.entity';

export class CreatePaymentDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  orderId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  vendorId?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  commissionAmount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  platformFee?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  netAmount?: number;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gatewayTransactionId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRefundable?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty()
  @IsNumber()
  createdById: number;
}

export class ProcessPaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gatewayTransactionId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gatewayResponse?: string;

  @ApiProperty()
  @IsNumber()
  processedById: number;
}

export class RefundPaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  refundAmount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refundReason: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gatewayRefundId?: string;

  @ApiProperty()
  @IsNumber()
  refundedById: number;
}

export class PayoutRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vendorId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ifscCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  upiId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payoutMethod: string;

  @ApiProperty()
  @IsNumber()
  requestedById: number;
}
