import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';

@Injectable()
export class WishlistRepository {
  constructor(
      @InjectRepository(Wishlist)
      private readonly repo: Repository<Wishlist>,
    ) {}
  
    create(data: Partial<Wishlist>){
      return this.repo.create(data);
    }
  
    async save(cart: Wishlist){
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
  
    async getAllWishlists(): Promise<Wishlist[]> {
      return this.repo.find({
        relations: ['user', 'createdBy', 'updatedBy'],
      });
    }
  
   async findByUserId(userId: number): Promise<Wishlist | null> {
  return this.repo.findOne({
    where: { user: { id: userId } },
    relations: ['user', 'createdBy', 'updatedBy'],
  });
}

}
