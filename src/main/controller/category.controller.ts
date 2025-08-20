import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { CategoryService } from '../service/category.service'; 
import { CreateCategoryDTO } from '../dto/requests/category/create-category.dto';
import { UpdateCategoryDTO } from '../dto/requests/category/update-category.dto';
import { CATEGORY_RESPONSES } from '../commons/constants/response-constants/category.constant'; 
import { ApiTags, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 200, description: 'Categories fetched', type: [CategoryResponseDto] })
  async findAll() {
    const categories = await this.categoryService.findAll();
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
