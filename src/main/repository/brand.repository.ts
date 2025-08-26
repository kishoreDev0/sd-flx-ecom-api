import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandRepository extends Repository<Brand> {
  constructor(private dataSource: DataSource) {
    super(Brand, dataSource.createEntityManager());
  }

  async findBrandById(id: number): Promise<Brand> {
    return this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'vendor', 'products', 'brandCategories', 'brandCategories.category'],
    });
  }

  async findBrandByName(brandName: string): Promise<Brand> {
    return this.findOne({
      where: { brandName },
    });
  }

  async findAllBrands(): Promise<Brand[]> {
    return this.find({
      relations: ['createdBy', 'updatedBy', 'vendor', 'products', 'brandCategories', 'brandCategories.category'],
      order: { brandName: 'ASC' },
    });
  }

  async findActiveBrands(): Promise<Brand[]> {
    return this.find({
      where: { isActive: true },
      relations: ['createdBy', 'updatedBy'],
      order: { brandName: 'ASC' },
    });
  }

  async findBrandsWithProducts(): Promise<Brand[]> {
    return this.find({
      relations: ['products', 'createdBy', 'updatedBy'],
      order: { brandName: 'ASC' },
    });
  }

  async findBrandsByUserId(userId: number): Promise<Brand[]> {
    return this.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'updatedBy', 'products'],
      order: { brandName: 'ASC' },
    });
  }

  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    const brand = this.create(brandData);
    return this.save(brand);
  }

  async updateBrand(id: number, brandData: Partial<Brand>): Promise<Brand> {
    await this.update(id, brandData);
    return this.findBrandById(id);
  }

  async deleteBrand(id: number): Promise<void> {
    await this.delete(id);
  }

  async softDeleteBrand(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  async restoreBrand(id: number): Promise<void> {
    await this.update(id, { isActive: true });
  }
}
