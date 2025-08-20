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
      isActive: category.isActive,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(createCategoryDto: CreateCategoryDTO): Promise<CategoryResponseDto> {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return this.toCategoryResponseDto(category);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find();
    return categories.map(cat => this.toCategoryResponseDto(cat));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(CATEGORY_RESPONSES.CATEGORY_NOT_FOUND().message);
    return this.toCategoryResponseDto(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDTO): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(CATEGORY_RESPONSES.CATEGORY_NOT_FOUND().message);

    Object.assign(category, updateCategoryDto);
    await this.categoryRepository.save(category);
    return this.toCategoryResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(CATEGORY_RESPONSES.CATEGORY_NOT_FOUND().message);
    await this.categoryRepository.remove(category);
  }
}
