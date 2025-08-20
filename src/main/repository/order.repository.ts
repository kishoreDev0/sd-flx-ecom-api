import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/main/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  create(data: Partial<Order>) {
    return this.repo.create(data);
  }

  async save(order: Order) {
    return this.repo.save(order);
  }

  async deleteById(id: number) {
    await this.repo.delete(id);
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.repo.find({
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.repo.find({
      where: { status: status as any },
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }
}