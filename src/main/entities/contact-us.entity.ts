import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('def_contact')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  companyName: string;

  @Column()
  queryOn: string;


   @OneToOne(() => Order, { nullable: true })
     @JoinColumn({ name: 'order_id' })
 // owns the relationship, adds orderId column
  orderId?: Order;

    @Column({ nullable: true })
    description: string;

  @Column()
  isActive: boolean;

  @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'updated_by' })
    updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
