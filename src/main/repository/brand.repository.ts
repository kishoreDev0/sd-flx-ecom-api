import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  async findBrandById(id: number): Promise<Brand> {
    return this.repo.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'vendor', 'products', 'brandCategories', 'brandCategories.category'],
    });
  }

  async findBrandByName(brandName: string): Promise<Brand> {
    return this.repo.findOne({
      where: { brandName },
    });
  }

  async findAllBrands(): Promise<Brand[]> {
    return this.repo.find({
      relations: ['createdBy', 'updatedBy', 'vendor', 'products', 'brandCategories', 'brandCategories.category'],
      order: { brandName: 'ASC' },
    });
  }

  async findActiveBrands(): Promise<Brand[]> {
    return this.repo.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy'],
      order: { brandName: 'ASC' },
    });
  }

  async findBrandsWithProducts(): Promise<Brand[]> {
    return this.repo.find({
      relations: ['products', 'createdBy', 'updatedBy'],
      order: { brandName: 'ASC' },
    });
  }

  async findBrandsByUserId(userId: number): Promise<Brand[]> {
    return this.repo.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'updatedBy', 'products'],
      order: { brandName: 'ASC' },
    });
  }

  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    const brand = this.repo.create(brandData);
    return this.repo.save(brand);
  }

  async updateBrand(id: number, brandData: Partial<Brand>): Promise<Brand> {
    await this.repo.update(id, brandData);
    return this.findBrandById(id);
  }

  async deleteBrand(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async softDeleteBrand(id: number): Promise<void> {
    await this.repo.update(id, { isActive: false });
  }

  async restoreBrand(id: number): Promise<void> {
    await this.repo.update(id, { isActive: true });
  }
}
