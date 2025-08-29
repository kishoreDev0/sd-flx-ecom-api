import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  GENERAL = 'general',
  ORDER_STATUS = 'order_status',
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  ACCOUNT_UPDATE = 'account_update',
  SECURITY_ALERT = 'security_alert',
  PROMOTIONAL = 'promotional',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  LOW_STOCK = 'low_stock',
  INVENTORY_UPDATE = 'inventory_update',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

@Entity('def_notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: NotificationType,
    nullable: false,
  })
  type: NotificationType;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'message',
    type: 'text',
    nullable: false,
  })
  message: string;

  @Column({
    name: 'priority',
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({
    name: 'status',
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({
    name: 'is_read',
    type: 'boolean',
    default: false,
  })
  isRead: boolean;

  @Column({
    name: 'read_at',
    type: 'datetime',
    nullable: true,
  })
  readAt: Date;

  @Column({
    name: 'sent_at',
    type: 'datetime',
    nullable: true,
  })
  sentAt: Date;

  @Column({
    name: 'delivered_at',
    type: 'datetime',
    nullable: true,
  })
  deliveredAt: Date;

  @Column({
    name: 'failed_at',
    type: 'datetime',
    nullable: true,
  })
  failedAt: Date;

  @Column({
    name: 'failure_reason',
    type: 'text',
    nullable: true,
  })
  failureReason: string;

  @Column({
    name: 'metadata',
    type: 'json',
    nullable: true,
    comment: 'Additional data for the notification',
  })
  metadata: any;

  @Column({
    name: 'expires_at',
    type: 'datetime',
    nullable: true,
    comment: 'When the notification expires',
  })
  expiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
