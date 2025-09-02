import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';
import { Category } from '../entities/category.entity';
import { CreateSubcategoryDto } from '../dto/requests/subcategory/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/requests/subcategory/update-subcategory.dto';
import { SubcategoryDto } from '../dto/responses/subcategory-response.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private toSubcategoryResponseDto(subcategory: Subcategory): SubcategoryDto {
    return {
      id: subcategory.id,
      subcategoryName: subcategory.subcategoryName,
      description: subcategory.description,
      categoryId: subcategory.categoryId,
      category: subcategory.category ? {
        id: subcategory.category.id,
        categoryName: subcategory.category.categoryName,
        description: subcategory.category.description,
      } : undefined,
      isActive: subcategory.isActive,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    };
  }

  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<SubcategoryDto> {
    // Verify that the parent category exists
    const category = await this.categoryRepository.findOneBy({ id: createSubcategoryDto.categoryId });
    if (!category) {
      throw new NotFoundException('Parent category not found');
    }

    const subcategory = this.subcategoryRepository.create(createSubcategoryDto);
    subcategory.category = category;
    
    await this.subcategoryRepository.save(subcategory);
    return this.toSubcategoryResponseDto(subcategory);
  }

  async findAll(): Promise<SubcategoryDto[]> {
    const subcategories = await this.subcategoryRepository.find({
      relations: ['category'],
    });
    return subcategories.map(sub => this.toSubcategoryResponseDto(sub));
  }

  async findOne(id: number): Promise<SubcategoryDto> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    return this.toSubcategoryResponseDto(subcategory);
  }

  async findByCategoryId(categoryId: number): Promise<SubcategoryDto[]> {
    const subcategories = await this.subcategoryRepository.find({
      where: { categoryId },
      relations: ['category'],
    });
    return subcategories.map(sub => this.toSubcategoryResponseDto(sub));
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): Promise<SubcategoryDto> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');

    if (updateSubcategoryDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateSubcategoryDto.categoryId });
      if (!category) {
        throw new NotFoundException('Parent category not found');
      }
      subcategory.category = category;
    }

    Object.assign(subcategory, updateSubcategoryDto);
    await this.subcategoryRepository.save(subcategory);
    return this.toSubcategoryResponseDto(subcategory);
  }

  async remove(id: number): Promise<void> {
    const subcategory = await this.subcategoryRepository.findOneBy({ id });
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    
    await this.subcategoryRepository.remove(subcategory);
  }
}
