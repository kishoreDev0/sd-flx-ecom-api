import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Brand } from './brand.entity';
import { Product } from './product.entity';

@Entity('def_vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'vendor_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  vendorName: string;

  @Column({
    name: 'business_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  businessName: string;

  @Column({
    name: 'business_address',
    type: 'text',
    nullable: true,
  })
  businessAddress: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'tax_id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  taxId: string;

  @Column({
    name: 'business_license',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  businessLicense: string;

  @Column({
    name: 'commission_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 10.00,
  })
  commissionRate: number;

  @Column({
    name: 'payout_method',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  payoutMethod: string;

  @Column({
    name: 'payout_account',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  payoutAccount: string;

  @Column({
    name: 'kyc_status',
    type: 'varchar',
    length: 50,
    default: 'pending',
  })
  kycStatus: string;

  @Column({
    name: 'kyc_documents',
    type: 'json',
    nullable: true,
  })
  kycDocuments: any;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'verification_date',
    type: 'timestamp',
    nullable: true,
  })
  verificationDate: Date;

  @Column({
    name: 'verification_notes',
    type: 'text',
    nullable: true,
  })
  verificationNotes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Brand, (brand) => brand.vendor)
  brands: Brand[];

  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];
}
