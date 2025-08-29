import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

export enum ShippingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}

export enum ShippingMethodType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  SAME_DAY = 'same_day',
  NEXT_DAY = 'next_day',
  ECONOMY = 'economy',
  PREMIUM = 'premium'
}

export enum CarrierType {
  FEDEX = 'fedex',
  UPS = 'ups',
  DHL = 'dhl',
  USPS = 'usps',
  AMAZON = 'amazon',
  LOCAL = 'local',
  CUSTOM = 'custom'
}

@Entity('def_shipping_addresses')
@Index(['userId'])
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  addressType: string; // 'home', 'work', 'other'

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('def_shipping_methods')
export class ShippingMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ 
    type: 'enum',
    enum: ShippingMethodType 
  })
  methodType: ShippingMethodType;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  additionalPrice: number;

  @Column({ type: 'int', default: 1 })
  minDeliveryDays: number;

  @Column({ type: 'int', default: 7 })
  maxDeliveryDays: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'simple-json', nullable: true })
  restrictions: {
    maxWeight?: number;
    maxDimensions?: string;
    excludedRegions?: string[];
    includedRegions?: string[];
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('def_shipping_zones')
export class ShippingZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'simple-json' })
  countries: string[];

  @Column({ type: 'simple-json', nullable: true })
  states: string[];

  @Column({ type: 'simple-json', nullable: true })
  postalCodes: string[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  baseShippingCost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  additionalItemCost: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('def_shipments')
@Index(['orderId'])
@Index(['trackingNumber'])
@Index(['status'])
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  shipmentNumber: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ 
    type: 'enum',
    enum: ShippingStatus, 
    default: ShippingStatus.PENDING 
  })
  status: ShippingStatus;

  @Column({ 
    type: 'enum',
    enum: CarrierType 
  })
  carrier: CarrierType;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  trackingUrl: string;

  @Column({ 
    type: 'enum',
    enum: ShippingMethodType 
  })
  shippingMethod: ShippingMethodType;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  @Column({ type: 'text' })
  originAddress: string;

  @Column({ type: 'text' })
  destinationAddress: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true })
  weightUnit: string;

  @Column({ type: 'simple-json', nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @Column({ type: 'text', nullable: true })
  packageType: string;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'text', nullable: true })
  deliveryNotes: string;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'simple-json', nullable: true })
  trackingHistory: {
    timestamp: Date;
    status: string;
    location: string;
    description: string;
  }[];

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    insuranceAmount?: number;
    signatureRequired?: boolean;
    fragile?: boolean;
    [key: string]: any;
  };

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
  createdById: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ name: 'updated_by', nullable: true })
  updatedById?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationship with shipping tracking
  @OneToMany(() => ShippingTracking, (tracking) => tracking.shipment)
  tracking: ShippingTracking[];
}

@Entity('def_shipping_tracking')
@Index(['shipmentId'])
@Index(['trackingNumber'])
export class ShippingTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shipment)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @Column({ name: 'shipment_id' })
  shipmentId: number;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ 
    type: 'enum',
    enum: ShippingStatus 
  })
  status: ShippingStatus;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    latitude?: number;
    longitude?: number;
    facility?: string;
    [key: string]: any;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
