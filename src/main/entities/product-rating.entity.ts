import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('def_product_ratings')
@Unique(['userId', 'productId'])
export class ProductRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @Column({
    name: 'product_id',
    type: 'int',
    nullable: false,
  })
  productId: number;

  @Column({
    name: 'rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: false,
    comment: 'Rating value from 1.0 to 5.0',
  })
  rating: number;

  @Column({
    name: 'review_title',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Title of the review',
  })
  reviewTitle: string;

  @Column({
    name: 'review_content',
    type: 'text',
    nullable: true,
    comment: 'Detailed review content',
  })
  reviewContent: string;

  @Column({
    name: 'is_verified_purchase',
    type: 'boolean',
    default: false,
    comment: 'Whether this is from a verified purchase',
  })
  isVerifiedPurchase: boolean;

  @Column({
    name: 'is_helpful',
    type: 'int',
    default: 0,
    comment: 'Number of users who found this review helpful',
  })
  isHelpful: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'Whether the rating is active/visible',
  })
  isActive: boolean;

  @Column({
    name: 'is_approved',
    type: 'boolean',
    default: false,
    comment: 'Whether the review has been approved by admin',
  })
  isApproved: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
