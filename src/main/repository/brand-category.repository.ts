import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandCategory } from '../entities/brand-category.entity';

@Injectable()
export class BrandCategoryRepository {
  constructor(
    @InjectRepository(BrandCategory)
    private readonly repo: Repository<BrandCategory>,
  ) {}

  async findById(id: number): Promise<BrandCategory> {
    return this.repo.findOne({
      where: { id },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
    });
  }

  async findByBrandId(brandId: number): Promise<BrandCategory[]> {
    return this.repo.find({
      where: { brandId, isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByCategoryId(categoryId: number): Promise<BrandCategory[]> {
    return this.repo.find({
      where: { categoryId, isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByBrandAndCategory(brandId: number, categoryId: number): Promise<BrandCategory> {
    return this.repo.findOne({
      where: { brandId, categoryId },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
    });
  }

  async findPrimaryCategoryByBrandId(brandId: number): Promise<BrandCategory> {
    return this.repo.findOne({
      where: { brandId, isPrimary: true, isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
    });
  }

  async findAllActive(): Promise<BrandCategory[]> {
    return this.repo.find({
      where: { isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
      order: { brandId: 'ASC', sortOrder: 'ASC' },
    });
  }

  async createMapping(mappingData: Partial<BrandCategory>): Promise<BrandCategory> {
    const mapping = this.repo.create(mappingData);
    return this.repo.save(mapping);
  }

  async updateMapping(id: number, mappingData: Partial<BrandCategory>): Promise<BrandCategory> {
    await this.repo.update(id, mappingData);
    return this.findById(id);
  }

  async deleteMapping(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async softDeleteMapping(id: number): Promise<void> {
    await this.repo.update(id, { isActive: false });
  }

  async restoreMapping(id: number): Promise<void> {
    await this.repo.update(id, { isActive: true });
  }

  async bulkCreateMappings(mappings: Partial<BrandCategory>[]): Promise<BrandCategory[]> {
    const createdMappings = this.repo.create(mappings);
    return this.repo.save(createdMappings);
  }

  async deleteMappingsByBrandId(brandId: number): Promise<void> {
    await this.repo.delete({ brandId });
  }

  async deleteMappingsByCategoryId(categoryId: number): Promise<void> {
    await this.repo.delete({ categoryId });
  }

  async setPrimaryCategory(brandId: number, categoryId: number): Promise<void> {
    // First, remove primary flag from all categories for this brand
    await this.repo.update({ brandId }, { isPrimary: false });
    
    // Then set the specified category as primary
    await this.repo.update({ brandId, categoryId }, { isPrimary: true });
  }

  async getBrandsByCategory(categoryId: number): Promise<BrandCategory[]> {
    return this.repo.find({
      where: { categoryId, isActive: true },
      relations: ['brand', 'category'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getCategoriesByBrand(brandId: number): Promise<BrandCategory[]> {
    return this.repo.find({
      where: { brandId, isActive: true },
      relations: ['brand', 'category'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getMappingStats(): Promise<{ total: number; active: number; inactive: number }> {
    const allMappings = await this.repo.find();
    const activeMappings = allMappings.filter(mapping => mapping.isActive);
    
    return {
      total: allMappings.length,
      active: activeMappings.length,
      inactive: allMappings.length - activeMappings.length,
    };
  }
}
