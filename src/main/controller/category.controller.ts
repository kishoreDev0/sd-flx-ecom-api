import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { CategoryService } from '../service/category.service'; 
import { CreateCategoryDTO } from '../dto/requests/category/create-category.dto';
import { UpdateCategoryDTO } from '../dto/requests/category/update-category.dto';
import { CATEGORY_RESPONSES } from '../commons/constants/response-constants/category.constant'; 
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from '../dto/responses/category-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CommonUtilService } from '../utils/common.util';
import { Roles } from '../commons/enumerations/role.enum';

@ApiTags('categories')
@Controller('v1/categories')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeadersForAuth()
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly commonUtilService: CommonUtilService,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 201, description: 'Category created', type: CategoryResponseDto })
  async create(@Body() createCategoryDto: CreateCategoryDTO, @Req() req: any) {
    // Extract user ID from request headers
    const userId = this.commonUtilService.getUserIdFromRequest(req);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Set the createdBy field with the authenticated user's ID
    createCategoryDto.createdBy = userId;
    
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
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Category updated', type: CategoryResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDTO, @Req() req: any) {
    // Extract user ID from request headers
    const userId = this.commonUtilService.getUserIdFromRequest(req);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Set the updatedBy field with the authenticated user's ID
    updateCategoryDto.updatedBy = userId;
    
    const category = await this.categoryService.update(id, updateCategoryDto);
    return CATEGORY_RESPONSES.CATEGORY_UPDATED(category);
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.remove(id);
    return CATEGORY_RESPONSES.CATEGORY_DELETED();
  }
}
