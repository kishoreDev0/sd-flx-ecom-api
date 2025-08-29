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
import { Product } from './product.entity';
import { Order } from './order.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SPAM = 'spam'
}

export enum ReviewType {
  PRODUCT = 'product',
  VENDOR = 'vendor',
  DELIVERY = 'delivery',
  CUSTOMER_SERVICE = 'customer_service'
}

@Entity('def_reviews')
@Index(['productId', 'status'])
@Index(['userId', 'productId'])
@Index(['rating'])
@Index(['reviewType'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ 
    type: 'enum',
    enum: ReviewType 
  })
  reviewType: ReviewType;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1-5 stars

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ 
    type: 'enum',
    enum: ReviewStatus, 
    default: ReviewStatus.PENDING 
  })
  status: ReviewStatus;

  @Column({ type: 'boolean', default: false })
  isVerifiedPurchase: boolean;

  @Column({ type: 'boolean', default: false })
  isHelpful: boolean;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @Column({ type: 'int', default: 0 })
  unhelpfulCount: number;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  adminResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  adminResponseAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;

  @Column({ type: 'text', nullable: true })
  editReason: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    deviceInfo?: string;
    location?: string;
    ipAddress?: string;
    userAgent?: string;
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

  // Relationship with review responses
  @OneToMany(() => ReviewResponse, (response) => response.review)
  responses: ReviewResponse[];

  // Relationship with review helpful votes
  @OneToMany(() => ReviewHelpfulVote, (vote) => vote.review)
  helpfulVotes: ReviewHelpfulVote[];
}

@Entity('def_review_responses')
@Index(['reviewId'])
export class ReviewResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review)
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column({ name: 'review_id' })
  reviewId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'responder_id' })
  responder: User;

  @Column({ name: 'responder_id' })
  responderId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isOfficialResponse: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('def_review_helpful_votes')
@Index(['reviewId', 'userId'])
export class ReviewHelpfulVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review)
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column({ name: 'review_id' })
  reviewId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'boolean' })
  isHelpful: boolean; // true for helpful, false for unhelpful

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('def_review_reports')
@Index(['reviewId'])
@Index(['reporterId'])
export class ReviewReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review)
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column({ name: 'review_id' })
  reviewId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ name: 'reporter_id' })
  reporterId: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'enum',
    enum: ReviewStatus, 
    default: ReviewStatus.PENDING 
  })
  status: ReviewStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolved_by' })
  resolvedBy: User;

  @Column({ name: 'resolved_by', nullable: true })
  resolvedById?: number;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
