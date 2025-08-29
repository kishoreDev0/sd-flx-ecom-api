import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod, PaymentType } from '../../entities/payment.entity';

export class PaymentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  transactionId: string;

  @ApiProperty({ required: false })
  orderId?: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false })
  vendorId?: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  commissionAmount: number;

  @ApiProperty()
  platformFee: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  netAmount: number;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ enum: PaymentMethod, required: false })
  paymentMethod?: PaymentMethod;

  @ApiProperty({ enum: PaymentType })
  paymentType: PaymentType;

  @ApiProperty({ required: false })
  gatewayTransactionId?: string;

  @ApiProperty({ required: false })
  gatewayResponse?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  failureReason?: string;

  @ApiProperty({ required: false })
  processedAt?: Date;

  @ApiProperty({ required: false })
  failedAt?: Date;

  @ApiProperty({ required: false })
  refundedAt?: Date;

  @ApiProperty()
  isRefundable: boolean;

  @ApiProperty({ required: false })
  refundReason?: string;

  @ApiProperty({ required: false })
  metadata?: {
    currency?: string;
    exchangeRate?: number;
    originalAmount?: number;
    originalCurrency?: string;
    [key: string]: any;
  };

  @ApiProperty()
  createdById: number;

  @ApiProperty({ required: false })
  updatedById?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // User details
  @ApiProperty({ required: false })
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  // Vendor details
  @ApiProperty({ required: false })
  vendor?: {
    id: number;
    vendorName: string;
    email: string;
  };

  // Order details
  @ApiProperty({ required: false })
  order?: {
    id: number;
    orderNumber: string;
    totalAmount: number;
  };
}

export class PaymentStatsDto {
  @ApiProperty()
  totalPayments: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  totalCommission: number;

  @ApiProperty()
  totalPlatformFees: number;

  @ApiProperty()
  pendingPayments: number;

  @ApiProperty()
  completedPayments: number;

  @ApiProperty()
  failedPayments: number;

  @ApiProperty()
  refundedPayments: number;

  @ApiProperty({ type: [Object] })
  paymentsByMethod: {
    method: PaymentMethod;
    count: number;
    amount: number;
  }[];

  @ApiProperty({ type: [Object] })
  paymentsByType: {
    type: PaymentType;
    count: number;
    amount: number;
  }[];
}

export class CommissionStatsDto {
  @ApiProperty()
  totalCommissions: number;

  @ApiProperty()
  pendingCommissions: number;

  @ApiProperty()
  paidCommissions: number;

  @ApiProperty()
  totalPayouts: number;

  @ApiProperty()
  pendingPayouts: number;

  @ApiProperty()
  completedPayouts: number;

  @ApiProperty({ type: [Object] })
  commissionsByVendor: {
    vendorId: number;
    vendorName: string;
    totalCommission: number;
    pendingCommission: number;
    paidCommission: number;
  }[];
}
