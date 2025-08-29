import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '../../entities/order.entity';

export class OrderItemResponseDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  vendorId: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false })
  vendorId?: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  orderItems: OrderItemResponseDto[];

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  shippingAmount: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty({ required: false })
  paymentMethod?: string;

  @ApiProperty({ required: false })
  paymentTransactionId?: string;

  @ApiProperty({ required: false })
  shippingAddress?: string;

  @ApiProperty({ required: false })
  billingAddress?: string;

  @ApiProperty({ required: false })
  customerPhone?: string;

  @ApiProperty({ required: false })
  customerEmail?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  vendorNotes?: string;

  @ApiProperty({ required: false })
  adminNotes?: string;

  @ApiProperty({ required: false })
  confirmedAt?: Date;

  @ApiProperty({ required: false })
  shippedAt?: Date;

  @ApiProperty({ required: false })
  deliveredAt?: Date;

  @ApiProperty({ required: false })
  cancelledAt?: Date;

  @ApiProperty({ required: false })
  refundedAt?: Date;

  @ApiProperty()
  isReturnRequested: boolean;

  @ApiProperty({ required: false })
  returnReason?: string;

  @ApiProperty({ required: false })
  returnRequestedAt?: Date;

  @ApiProperty()
  isEscalated: boolean;

  @ApiProperty({ required: false })
  escalationReason?: string;

  @ApiProperty({ required: false })
  escalatedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdById: number;

  @ApiProperty({ required: false })
  updatedById?: number;

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

  // Tracking information
  @ApiProperty({ required: false, type: [Object] })
  tracking?: any[];
}


