import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { Vendor } from './vendor.entity';
import { ProductRating } from './product-rating.entity';

@Entity('def_product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('varchar')
  description: string;

  @Column('simple-json', { nullable: true })
  imagesPath: string[];

  // ✅ Replace string with Category relation
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // Brand relationship
  @ManyToOne(() => Brand, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // Vendor relationship
  @ManyToOne(() => Vendor, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  // Relationship with ratings
  @OneToMany(() => ProductRating, (rating) => rating.product)
  ratings: ProductRating[];

  @Column('simple-array', { nullable: true })
  features: number[];

  @Column()
  price: number;

  @Column({ type: 'boolean', default: true })
  inStock: boolean;

  @Column({ type: 'int', default: 0 })
  noOfStock: number;

  @Column()
  totalNoOfStock: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
