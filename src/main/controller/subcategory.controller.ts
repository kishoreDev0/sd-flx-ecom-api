import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { SubcategoryService } from '../service/subcategory.service';
import { CreateSubcategoryDto } from '../dto/requests/subcategory/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/requests/subcategory/update-subcategory.dto';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SubcategoryDto, SubcategoriesResponseWrapper, SubcategoryResponseWrapper } from '../dto/responses/subcategory-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CommonUtilService } from '../utils/common.util';
import { Roles } from '../commons/enumerations/role.enum';

@ApiTags('subcategories')
@Controller('v1/subcategories')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeadersForAuth()
export class SubcategoryController {
  constructor(
    private readonly subcategoryService: SubcategoryService,
    private readonly commonUtilService: CommonUtilService,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 201, description: 'Subcategory created', type: SubcategoryResponseWrapper })
  async create(@Body() createSubcategoryDto: CreateSubcategoryDto, @Req() req: any) {
    // Extract user ID from request headers
    const userId = this.commonUtilService.getUserIdFromRequest(req);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Set the createdBy field with the authenticated user's ID
    createSubcategoryDto.createdBy = userId;
    
    const subcategory = await this.subcategoryService.create(createSubcategoryDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Subcategory created successfully',
      data: subcategory,
    };
  }

  @Get()
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'Filter subcategories by category ID' })
  @ApiResponse({ status: 200, description: 'Subcategories fetched', type: SubcategoriesResponseWrapper })
  async findAll(@Query('categoryId') categoryId?: number) {
    let subcategories: SubcategoryDto[];
    
    if (categoryId) {
      subcategories = await this.subcategoryService.findByCategoryId(categoryId);
    } else {
      subcategories = await this.subcategoryService.findAll();
    }
    
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subcategories fetched successfully',
      data: subcategories,
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Subcategory found', type: SubcategoryResponseWrapper })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const subcategory = await this.subcategoryService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subcategory fetched successfully',
      data: subcategory,
    };
  }

  @Get('category/:categoryId')
  @ApiResponse({ status: 200, description: 'Subcategories by category fetched', type: SubcategoriesResponseWrapper })
  async findByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    const subcategories = await this.subcategoryService.findByCategoryId(categoryId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subcategories by category fetched successfully',
      data: subcategories,
    };
  }

  @Patch(':id')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Subcategory updated', type: SubcategoryResponseWrapper })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSubcategoryDto: UpdateSubcategoryDto, @Req() req: any) {
    // Extract user ID from request headers
    const userId = this.commonUtilService.getUserIdFromRequest(req);
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const subcategory = await this.subcategoryService.update(id, updateSubcategoryDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subcategory updated successfully',
      data: subcategory,
    };
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.subcategoryService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subcategory deleted successfully',
      data: null,
    };
  }
}
