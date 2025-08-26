import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BrandCategoryRepository } from '../repository/brand-category.repository';
import { BrandRepository } from '../repository/brand.repository';
import { CategoryRepository } from '../repository/category.repository';
import { UserRepository } from '../repository/user.repository';
import { CreateBrandCategoryDto } from '../dto/requests/brand-category/create-brand-category.dto';
import { UpdateBrandCategoryDto } from '../dto/requests/brand-category/update-brand-category.dto';
import { BulkCreateBrandCategoryDto } from '../dto/requests/brand-category/bulk-create-brand-category.dto';
import { BrandCategory } from '../entities/brand-category.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BrandCategoryService {
  constructor(
    private readonly brandCategoryRepository: BrandCategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createBrandCategoryDto: CreateBrandCategoryDto, user: User): Promise<BrandCategory> {
    // Check if brand exists
    const brand = await this.brandRepository.findBrandById(createBrandCategoryDto.brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    // Check if category exists
    const category = await this.categoryRepository.findById(createBrandCategoryDto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if mapping already exists
    const existingMapping = await this.brandCategoryRepository.findByBrandAndCategory(
      createBrandCategoryDto.brandId,
      createBrandCategoryDto.categoryId,
    );
    if (existingMapping) {
      throw new ConflictException('Brand category mapping already exists');
    }

    const mappingData = {
      ...createBrandCategoryDto,
      createdBy: user,
      updatedBy: user,
    };

    return this.brandCategoryRepository.createMapping(mappingData);
  }

  async bulkCreate(bulkCreateDto: BulkCreateBrandCategoryDto, user: User): Promise<BrandCategory[]> {
    // Check if brand exists
    const brand = await this.brandRepository.findBrandById(bulkCreateDto.brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const mappings: Partial<BrandCategory>[] = [];

    for (const categoryMapping of bulkCreateDto.categories) {
      // Check if category exists
      const category = await this.categoryRepository.findById(categoryMapping.categoryId);
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryMapping.categoryId} not found`);
      }

      // Check if mapping already exists
      const existingMapping = await this.brandCategoryRepository.findByBrandAndCategory(
        bulkCreateDto.brandId,
        categoryMapping.categoryId,
      );
      if (existingMapping) {
        throw new ConflictException(`Brand category mapping already exists for category ${categoryMapping.categoryId}`);
      }

      mappings.push({
        brandId: bulkCreateDto.brandId,
        categoryId: categoryMapping.categoryId,
        isPrimary: categoryMapping.isPrimary || false,
        sortOrder: categoryMapping.sortOrder || 0,
        isActive: categoryMapping.isActive !== false,
        createdBy: user,
        updatedBy: user,
      });
    }

    return this.brandCategoryRepository.bulkCreateMappings(mappings);
  }

  async findAll(): Promise<BrandCategory[]> {
    return this.brandCategoryRepository.findAllActive();
  }

  async findById(id: number): Promise<BrandCategory> {
    const mapping = await this.brandCategoryRepository.findById(id);
    if (!mapping) {
      throw new NotFoundException('Brand category mapping not found');
    }
    return mapping;
  }

  async findByBrandId(brandId: number): Promise<BrandCategory[]> {
    // Check if brand exists
    const brand = await this.brandRepository.findBrandById(brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return this.brandCategoryRepository.findByBrandId(brandId);
  }

  async findByCategoryId(categoryId: number): Promise<BrandCategory[]> {
    // Check if category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.brandCategoryRepository.findByCategoryId(categoryId);
  }

  async findPrimaryCategoryByBrandId(brandId: number): Promise<BrandCategory> {
    const mapping = await this.brandCategoryRepository.findPrimaryCategoryByBrandId(brandId);
    if (!mapping) {
      throw new NotFoundException('Primary category not found for this brand');
    }
    return mapping;
  }

  async update(id: number, updateBrandCategoryDto: UpdateBrandCategoryDto, user: User): Promise<BrandCategory> {
    const existingMapping = await this.brandCategoryRepository.findById(id);
    if (!existingMapping) {
      throw new NotFoundException('Brand category mapping not found');
    }

    const updateData = {
      ...updateBrandCategoryDto,
      updatedBy: user,
    };

    return this.brandCategoryRepository.updateMapping(id, updateData);
  }

  async remove(id: number): Promise<void> {
    const mapping = await this.brandCategoryRepository.findById(id);
    if (!mapping) {
      throw new NotFoundException('Brand category mapping not found');
    }

    await this.brandCategoryRepository.deleteMapping(id);
  }

  async softDelete(id: number): Promise<void> {
    const mapping = await this.brandCategoryRepository.findById(id);
    if (!mapping) {
      throw new NotFoundException('Brand category mapping not found');
    }

    await this.brandCategoryRepository.softDeleteMapping(id);
  }

  async restore(id: number): Promise<void> {
    const mapping = await this.brandCategoryRepository.findById(id);
    if (!mapping) {
      throw new NotFoundException('Brand category mapping not found');
    }

    await this.brandCategoryRepository.restoreMapping(id);
  }

  async setPrimaryCategory(brandId: number, categoryId: number): Promise<void> {
    // Check if brand exists
    const brand = await this.brandRepository.findBrandById(brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    // Check if category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if mapping exists
    const mapping = await this.brandCategoryRepository.findByBrandAndCategory(brandId, categoryId);
    if (!mapping) {
      throw new NotFoundException('Brand category mapping not found');
    }

    await this.brandCategoryRepository.setPrimaryCategory(brandId, categoryId);
  }

  async getBrandsByCategory(categoryId: number): Promise<BrandCategory[]> {
    // Check if category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.brandCategoryRepository.getBrandsByCategory(categoryId);
  }

  async getCategoriesByBrand(brandId: number): Promise<BrandCategory[]> {
    // Check if brand exists
    const brand = await this.brandRepository.findBrandById(brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return this.brandCategoryRepository.getCategoriesByBrand(brandId);
  }

  async getMappingStats(): Promise<{ total: number; active: number; inactive: number }> {
    return this.brandCategoryRepository.getMappingStats();
  }
}
