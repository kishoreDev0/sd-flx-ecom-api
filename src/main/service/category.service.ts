import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity'; 
import { CreateCategoryDTO } from '../dto/requests/category/create-category.dto'; 
import { UpdateCategoryDTO } from '../dto/requests/category/update-category.dto';
import { CATEGORY_RESPONSES } from '../commons/constants/response-constants/category.constant'; 
import { CategoryResponseDto } from '../dto/responses/category-response.dto'; 

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private toCategoryResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      categoryName: category.categoryName,
      description: category.description,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
      seoKeywords: category.seoKeywords,
      parentId: category.parent?.id,
      parent: category.parent ? this.toCategoryResponseDto(category.parent) : undefined,
      children: category.children?.map(child => this.toCategoryResponseDto(child)),
      isActive: category.isActive,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(createCategoryDto: CreateCategoryDTO): Promise<CategoryResponseDto> {
    const category = this.categoryRepository.create(createCategoryDto);
    
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOneBy({ id: createCategoryDto.parentId });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parent;
    }
    
    await this.categoryRepository.save(category);
    return this.toCategoryResponseDto(category);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
    return categories.map(cat => this.toCategoryResponseDto(cat));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!category) throw new NotFoundException(CATEGORY_RESPONSES.CATEGORY_NOT_FOUND().message);
    return this.toCategoryResponseDto(category);
  }

  async findRootCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { parent: null },
      relations: ['children'],
    });
    return categories.map(cat => this.toCategoryResponseDto(cat));
  }

  async findSubcategories(parentId: number): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { parent: { id: parentId } },
      relations: ['children'],
    });
    return categories.map(cat => this.toCategoryResponseDto(cat));
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDTO): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!category) throw new NotFoundException(CATEGORY_RESPONSES.CATEGORY_NOT_FOUND().message);

    if (updateCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOneBy({ id: updateCategoryDto.parentId });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parent;
    }

    Object.assign(category, updateCategoryDto);
    await this.categoryRepository.save(category);
    return this.toCategoryResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!category) throw new NotFoundException(CATEGORY_RESPONSES.CATEGORY_NOT_FOUND().message);
    
    if (category.children && category.children.length > 0) {
      throw new NotFoundException('Cannot delete category with subcategories');
    }
    
    await this.categoryRepository.remove(category);
  }
}
