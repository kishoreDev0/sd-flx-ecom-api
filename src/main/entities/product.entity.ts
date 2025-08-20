import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity'; 

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
