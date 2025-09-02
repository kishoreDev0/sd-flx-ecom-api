import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFeature } from '../entities/product-feature.entity';

@Injectable()
export class ProductFeatureRepository {
  constructor(
    @InjectRepository(ProductFeature)
    private readonly repo: Repository<ProductFeature>,
  ) {}

  async create(data: Partial<ProductFeature>): Promise<ProductFeature> {
    const productFeature = this.repo.create(data);
    return this.repo.save(productFeature);
  }

  async createMany(productId: number, featureIds: number[]): Promise<ProductFeature[]> {
    const productFeatures = featureIds.map(featureId => ({
      productId,
      featureId,
    }));
    
    return this.repo.save(productFeatures);
  }

  async findByProductId(productId: number): Promise<ProductFeature[]> {
    return this.repo.find({
      where: { productId },
      relations: ['feature'],
    });
  }

  async deleteByProductId(productId: number): Promise<void> {
    await this.repo.delete({ productId });
  }

  async updateProductFeatures(productId: number, featureIds: number[]): Promise<void> {
    // Delete existing features for this product
    await this.deleteByProductId(productId);
    
    // Create new feature mappings
    if (featureIds && featureIds.length > 0) {
      await this.createMany(productId, featureIds);
    }
  }
}

