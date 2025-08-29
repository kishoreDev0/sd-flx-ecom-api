import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { Vendor } from './vendor.entity';
import { User } from './user.entity';

@Entity('def_inventory')
@Index(['productId', 'vendorId'])
@Index(['lowStockThreshold'])
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ name: 'vendor_id' })
  vendorId: number;

  @Column({ type: 'int', default: 0 })
  currentStock: number;

  @Column({ type: 'int', default: 0 })
  reservedStock: number;

  @Column({ type: 'int', default: 0 })
  availableStock: number;

  @Column({ type: 'int', default: 0 })
  lowStockThreshold: number;

  @Column({ type: 'boolean', default: false })
  isLowStock: boolean;

  @Column({ type: 'boolean', default: false })
  isOutOfStock: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastStockUpdate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLowStockAlert: Date;

  @Column({ type: 'text', nullable: true })
  stockNotes: string;

  @Column({ type: 'simple-json', nullable: true })
  stockHistory: {
    date: Date;
    quantity: number;
    type: 'in' | 'out' | 'adjustment';
    reason: string;
    reference?: string;
  }[];

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
}
