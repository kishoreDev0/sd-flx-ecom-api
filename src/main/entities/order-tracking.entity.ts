import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

@Entity('def_order_tracking')
export class OrderTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'order_id',
    type: 'int',
    nullable: false,
  })
  orderId: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    nullable: false,
  })
  status: OrderStatus;

  @Column({
    name: 'status_description',
    type: 'text',
    nullable: true,
    comment: 'Detailed description of the status change',
  })
  statusDescription: string;

  @Column({
    name: 'location',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Current location of the order',
  })
  location: string;

  @Column({
    name: 'tracking_number',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Shipping tracking number',
  })
  trackingNumber: string;

  @Column({
    name: 'carrier',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Shipping carrier name',
  })
  carrier: string;

  @Column({
    name: 'estimated_delivery',
    type: 'datetime',
    nullable: true,
    comment: 'Estimated delivery date',
  })
  estimatedDelivery: Date;

  @Column({
    name: 'actual_delivery',
    type: 'datetime',
    nullable: true,
    comment: 'Actual delivery date',
  })
  actualDelivery: Date;

  @Column({
    name: 'is_notification_sent',
    type: 'boolean',
    default: false,
    comment: 'Whether notification was sent for this status change',
  })
  isNotificationSent: boolean;

  @Column({
    name: 'notification_sent_at',
    type: 'datetime',
    nullable: true,
    comment: 'When notification was sent',
  })
  notificationSentAt: Date;

  @Column({
    name: 'created_by',
    type: 'int',
    nullable: false,
  })
  createdBy: number;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
