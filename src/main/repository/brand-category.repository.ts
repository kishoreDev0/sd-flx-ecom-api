import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BrandCategory } from '../entities/brand-category.entity';

@Injectable()
export class BrandCategoryRepository extends Repository<BrandCategory> {
  constructor(private dataSource: DataSource) {
    super(BrandCategory, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<BrandCategory> {
    return this.findOne({
      where: { id },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
    });
  }

  async findByBrandId(brandId: number): Promise<BrandCategory[]> {
    return this.find({
      where: { brandId, isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByCategoryId(categoryId: number): Promise<BrandCategory[]> {
    return this.find({
      where: { categoryId, isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByBrandAndCategory(brandId: number, categoryId: number): Promise<BrandCategory> {
    return this.findOne({
      where: { brandId, categoryId },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
    });
  }

  async findPrimaryCategoryByBrandId(brandId: number): Promise<BrandCategory> {
    return this.findOne({
      where: { brandId, isPrimary: true, isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
    });
  }

  async findAllActive(): Promise<BrandCategory[]> {
    return this.find({
      where: { isActive: true },
      relations: ['brand', 'category', 'createdBy', 'updatedBy'],
      order: { brandId: 'ASC', sortOrder: 'ASC' },
    });
  }

  async createMapping(mappingData: Partial<BrandCategory>): Promise<BrandCategory> {
    const mapping = this.create(mappingData);
    return this.save(mapping);
  }

  async updateMapping(id: number, mappingData: Partial<BrandCategory>): Promise<BrandCategory> {
    await this.update(id, mappingData);
    return this.findById(id);
  }

  async deleteMapping(id: number): Promise<void> {
    await this.delete(id);
  }

  async softDeleteMapping(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  async restoreMapping(id: number): Promise<void> {
    await this.update(id, { isActive: true });
  }

  async bulkCreateMappings(mappings: Partial<BrandCategory>[]): Promise<BrandCategory[]> {
    const createdMappings = this.create(mappings);
    return this.save(createdMappings);
  }

  async deleteMappingsByBrandId(brandId: number): Promise<void> {
    await this.delete({ brandId });
  }

  async deleteMappingsByCategoryId(categoryId: number): Promise<void> {
    await this.delete({ categoryId });
  }

  async setPrimaryCategory(brandId: number, categoryId: number): Promise<void> {
    // First, remove primary flag from all categories for this brand
    await this.update({ brandId }, { isPrimary: false });
    
    // Then set the specified category as primary
    await this.update({ brandId, categoryId }, { isPrimary: true });
  }

  async getBrandsByCategory(categoryId: number): Promise<BrandCategory[]> {
    return this.find({
      where: { categoryId, isActive: true },
      relations: ['brand', 'category'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getCategoriesByBrand(brandId: number): Promise<BrandCategory[]> {
    return this.find({
      where: { brandId, isActive: true },
      relations: ['brand', 'category'],
      order: { sortOrder: 'ASC' },
    });
  }

  async getMappingStats(): Promise<{ total: number; active: number; inactive: number }> {
    const allMappings = await this.find();
    const activeMappings = allMappings.filter(mapping => mapping.isActive);
    
    return {
      total: allMappings.length,
      active: activeMappings.length,
      inactive: allMappings.length - activeMappings.length,
    };
  }
}
