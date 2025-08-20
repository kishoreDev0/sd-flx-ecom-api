import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('def_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: '',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: '',
  })
  lastName: string;

  @Column({
    name: 'official_email',
    type: 'varchar',
    nullable: false,
  })
  officialEmail: string;

  @Column({
    name: 'primary_phone',
    type: 'varchar',
    nullable: true,
  })
  primaryPhone: string;

  @Column({ name: 'TRL_id', type: 'varchar', length: 255, nullable: true })
  trlId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  imageURL: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'reset_token',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: '',
  })
  resetToken: string;

  @Column({
    name: 'reset_token_expires',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  resetTokenExpires: Date;

  @Column({
    name: 'last_login_time',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  lastLoginTime: Date;

  @Column({
    name: 'created_by',
    type: 'int',
    nullable: true,
    default: null,
  })
  createdBy: number;

  @Column({
    name: 'updated_by',
    type: 'int',
    nullable: true,
    default: null,
  })
  updatedBy: number;

  @CreateDateColumn({ name: 'created_at', nullable: true, default: null })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: null })
  updatedAt: Date;
}
