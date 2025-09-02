import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BrandCategory } from './brand-category.entity';
import { Subcategory } from './subcategory.entity';

@Entity('def_category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  categoryName: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  seoTitle?: string;

  @Column({ type: 'text', nullable: true })
  seoDescription?: string;

  @Column({ type: 'simple-array', nullable: true })
  seoKeywords?: string[];

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

  // Relationship with subcategories
  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories?: Subcategory[];

  // Relationship with brands through mapping table
  @OneToMany(() => BrandCategory, (brandCategory) => brandCategory.category)
  brandCategories: BrandCategory[];
}
