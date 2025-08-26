import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Vendor } from './vendor.entity';
import { BrandCategory } from './brand-category.entity';

@Entity('def_brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'brand_name',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  brandName: string;

  @Column({
    name: 'brand_description',
    type: 'text',
    nullable: true,
  })
  brandDescription: string;

  @Column({
    name: 'brand_logo',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  brandLogo: string;

  @Column({
    name: 'website_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  websiteUrl: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @ManyToOne(() => Vendor, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationship with products
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  // Relationship with categories through mapping table
  @OneToMany(() => BrandCategory, (brandCategory) => brandCategory.brand)
  brandCategories: BrandCategory[];
}
