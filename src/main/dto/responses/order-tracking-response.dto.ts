import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../entities/order-tracking.entity';

export class OrderTrackingDto {
  @ApiProperty({
    description: 'Tracking ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Order ID',
    example: 1,
  })
  orderId: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
  })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Status description',
    example: 'Order shipped via FedEx',
  })
  statusDescription?: string;

  @ApiPropertyOptional({
    description: 'Current location',
    example: 'Distribution Center',
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'Tracking number',
    example: 'TRK123456789',
  })
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Shipping carrier',
    example: 'FedEx',
  })
  carrier?: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  estimatedDelivery?: Date;

  @ApiPropertyOptional({
    description: 'Actual delivery date',
    example: '2024-01-15T10:00:00Z',
  })
  actualDelivery?: Date;

  @ApiProperty({
    description: 'Whether notification was sent',
    example: true,
  })
  isNotificationSent: boolean;

  @ApiPropertyOptional({
    description: 'When notification was sent',
    example: '2024-01-15T10:00:00Z',
  })
  notificationSentAt?: Date;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Order information',
  })
  order?: any;

  @ApiPropertyOptional({
    description: 'User information',
  })
  user?: any;
}

export class OrderTrackingHistoryDto {
  @ApiProperty({
    description: 'Order ID',
    example: 1,
  })
  orderId: number;

  @ApiProperty({
    description: 'Tracking history',
    type: [OrderTrackingDto],
  })
  trackingHistory: OrderTrackingDto[];

  @ApiProperty({
    description: 'Current status',
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
  })
  currentStatus: OrderStatus;

  @ApiPropertyOptional({
    description: 'Latest tracking entry',
    type: OrderTrackingDto,
  })
  latestTracking?: OrderTrackingDto;
}

export class OrderTrackingStatsDto {
  @ApiProperty({
    description: 'Total orders',
    example: 100,
  })
  totalOrders: number;

  @ApiProperty({
    description: 'Pending orders',
    example: 20,
  })
  pendingOrders: number;

  @ApiProperty({
    description: 'Shipped orders',
    example: 30,
  })
  shippedOrders: number;

  @ApiProperty({
    description: 'Delivered orders',
    example: 40,
  })
  deliveredOrders: number;

  @ApiProperty({
    description: 'Cancelled orders',
    example: 10,
  })
  cancelledOrders: number;
}

export class OrderTrackingResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Order tracking created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Order tracking data',
    type: OrderTrackingDto,
  })
  data: OrderTrackingDto;
}

export class OrderTrackingHistoryResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Order tracking history retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Order tracking history data',
    type: OrderTrackingHistoryDto,
  })
  data: OrderTrackingHistoryDto;
}

export class OrderTrackingStatsResponseWrapper {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Order tracking statistics retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Order tracking statistics',
    type: OrderTrackingStatsDto,
  })
  data: OrderTrackingStatsDto;
}
