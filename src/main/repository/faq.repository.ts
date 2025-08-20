import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from 'src/main/entities/faq.entity';
import { LoggerService } from '../service/logger.service';

@Injectable()
export class FaqRepository {
  constructor(
    @InjectRepository(Faq)
    private readonly repository: Repository<Faq>,
    private readonly logger: LoggerService,
  ) {}

  async findById(id: number): Promise<Faq | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

   create(data: Partial<Faq>) {
      return this.repository.create(data);
    }

  async getAll(): Promise<Faq[]> {
    return this.repository.find();
  }

  async save(faq: Faq){
    return this.repository.save(faq);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
