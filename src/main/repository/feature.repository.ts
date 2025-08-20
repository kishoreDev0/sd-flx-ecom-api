import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature } from 'src/main/entities/feature.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeatureRepository {
  constructor(
    @InjectRepository(Feature)
    private readonly repo: Repository<Feature>,
  ) {}

  create(data: Partial<Feature>) {
    return this.repo.create(data);
  }

  async save(feature: Feature) {
    return this.repo.save(feature);
  }

  async deleteById(id: number) {
    return this.repo.delete(id);
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async getAllFeatures(): Promise<Feature[]> {
  return this.repo.find({
    relations: ['createdBy', 'updatedBy'],
    order: { createdAt: 'DESC' },
  });
}

}
