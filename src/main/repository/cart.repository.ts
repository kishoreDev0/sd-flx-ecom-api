import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/main/entities/cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repo: Repository<Cart>,
  ) {}

  create(data: Partial<Cart>){
    return this.repo.create(data);
  }

  async save(cart: Cart){
    return this.repo.save(cart);
  }

  async deleteById(id: number){
    await this.repo.delete(id);
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }

  async getAllCarts(): Promise<Cart[]> {
    return this.repo.find({
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }

  async findByUserId(userId: number): Promise<Cart | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'createdBy', 'updatedBy'],
    });
  }
}
