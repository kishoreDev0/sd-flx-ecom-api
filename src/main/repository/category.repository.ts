import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/main/entities/category.entity';
import { LoggerService } from '../service/logger.service';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private readonly logger: LoggerService,
  ) {}

  async findById(id: number): Promise<Category | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async getAll(): Promise<Category[]> {
    return this.repository.find();
  }

  async save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
