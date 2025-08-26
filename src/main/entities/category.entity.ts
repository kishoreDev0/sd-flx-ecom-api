import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BrandCategory } from './brand-category.entity';

@Entity('def_category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  categoryName: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  isActive: boolean;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  updatedBy?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationship with brands through mapping table
  @OneToMany(() => BrandCategory, (brandCategory) => brandCategory.category)
  brandCategories: BrandCategory[];
}
