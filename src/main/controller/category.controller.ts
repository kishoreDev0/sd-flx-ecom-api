import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus, Patch, Query } from '@nestjs/common';
import { CategoryService } from '../service/category.service'; 
import { CreateCategoryDTO } from '../dto/requests/category/create-category.dto';
import { UpdateCategoryDTO } from '../dto/requests/category/update-category.dto';
import { CATEGORY_RESPONSES } from '../commons/constants/response-constants/category.constant'; 
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CategoryResponseDto } from '../dto/responses/category-response.dto';

@ApiTags('categories')
@Controller('v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Category created', type: CategoryResponseDto })
  async create(@Body() createCategoryDto: CreateCategoryDTO) {
    const category = await this.categoryService.create(createCategoryDto);
    return CATEGORY_RESPONSES.CATEGORY_CREATED(category);
  }

  @Get()
  @ApiQuery({ name: 'type', required: false, enum: ['all', 'root', 'subcategories'], description: 'Filter categories by type' })
  @ApiQuery({ name: 'parentId', required: false, type: Number, description: 'Parent ID for subcategories' })
  @ApiResponse({ status: 200, description: 'Categories fetched', type: [CategoryResponseDto] })
  async findAll(@Query('type') type?: string, @Query('parentId') parentId?: number) {
    let categories: CategoryResponseDto[];
    
    if (type === 'root') {
      categories = await this.categoryService.findRootCategories();
    } else if (type === 'subcategories' && parentId) {
      categories = await this.categoryService.findSubcategories(parentId);
    } else {
      categories = await this.categoryService.findAll();
    }
    
    return CATEGORY_RESPONSES.CATEGORIES_FETCHED(categories);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Category found', type: CategoryResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Category fetched successfully',
      data: category,
    };
  }

  @Get(':id/subcategories')
  @ApiResponse({ status: 200, description: 'Subcategories fetched', type: [CategoryResponseDto] })
  async findSubcategories(@Param('id', ParseIntPipe) id: number) {
    const subcategories = await this.categoryService.findSubcategories(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subcategories fetched successfully',
      data: subcategories,
    };
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Category updated', type: CategoryResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDTO) {
    const category = await this.categoryService.update(id, updateCategoryDto);
    return CATEGORY_RESPONSES.CATEGORY_UPDATED(category);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.remove(id);
    return CATEGORY_RESPONSES.CATEGORY_DELETED();
  }
}
