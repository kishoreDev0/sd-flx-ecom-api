import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
}
