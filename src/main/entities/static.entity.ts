import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('def_static')
export class Static {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

@Column({ type: 'text', nullable: false })
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
