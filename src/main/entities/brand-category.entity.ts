import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity('def_brand_categories')
@Unique(['brandId', 'categoryId'])
export class BrandCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'brand_id',
    type: 'int',
    nullable: false,
  })
  brandId: number;

  @Column({
    name: 'category_id',
    type: 'int',
    nullable: false,
  })
  categoryId: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'is_primary',
    type: 'boolean',
    default: false,
    comment: 'Indicates if this is the primary category for the brand',
  })
  isPrimary: boolean;

  @Column({
    name: 'sort_order',
    type: 'int',
    default: 0,
    comment: 'Order in which categories are displayed for a brand',
  })
  sortOrder: number;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

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
}
