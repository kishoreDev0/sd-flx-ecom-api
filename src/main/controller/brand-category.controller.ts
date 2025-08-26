import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BrandCategoryService } from '../service/brand-category.service';
import { CreateBrandCategoryDto } from '../dto/requests/brand-category/create-brand-category.dto';
import { UpdateBrandCategoryDto } from '../dto/requests/brand-category/update-brand-category.dto';
import { BulkCreateBrandCategoryDto } from '../dto/requests/brand-category/bulk-create-brand-category.dto';
import { 
  BrandCategoryResponseWrapper, 
  BrandCategoriesResponseWrapper 
} from '../dto/responses/brand-category-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { Public } from '../commons/decorators/public.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';

@ApiTags('Brand Categories')
@Controller('v1/brand-categories')
@UseGuards(AuthGuard)
@ApiHeadersForAuth()
export class BrandCategoryController {
  constructor(
    private readonly brandCategoryService: BrandCategoryService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: BrandCategoryResponseWrapper })
  async create(@Body() createBrandCategoryDto: CreateBrandCategoryDto, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const user = await this.commonUtilService.getUserById(userId);
      const mapping = await this.brandCategoryService.create(createBrandCategoryDto, user);
      
      return {
        success: true,
        message: 'Brand category mapping created successfully',
        data: mapping,
      };
    } catch (error) {
      this.loggerService.error('Error creating brand category mapping', error);
      throw error;
    }
  }

  @Post('bulk')
  @ApiResponse({ status: 201, type: BrandCategoriesResponseWrapper })
  async bulkCreate(@Body() bulkCreateDto: BulkCreateBrandCategoryDto, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const user = await this.commonUtilService.getUserById(userId);
      const mappings = await this.brandCategoryService.bulkCreate(bulkCreateDto, user);
      
      return {
        success: true,
        message: 'Brand category mappings created successfully',
        data: mappings,
      };
    } catch (error) {
      this.loggerService.error('Error creating bulk brand category mappings', error);
      throw error;
    }
  }

  @Get()
  @ApiResponse({ status: 200, type: BrandCategoriesResponseWrapper })
  async findAll() {
    try {
      const mappings = await this.brandCategoryService.findAll();
      
      return {
        success: true,
        message: 'Brand category mappings retrieved successfully',
        data: mappings,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand category mappings', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiResponse({ status: 200, description: 'Brand category mapping statistics' })
  async getStats() {
    try {
      const stats = await this.brandCategoryService.getMappingStats();
      
      return {
        success: true,
        message: 'Brand category mapping statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand category mapping stats', error);
      throw error;
    }
  }

  @Get('brand/:brandId')
  @ApiResponse({ status: 200, type: BrandCategoriesResponseWrapper })
  async findByBrandId(@Param('brandId', ParseIntPipe) brandId: number) {
    try {
      const mappings = await this.brandCategoryService.findByBrandId(brandId);
      
      return {
        success: true,
        message: 'Brand category mappings retrieved successfully',
        data: mappings,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand category mappings by brand ID', error);
      throw error;
    }
  }

  @Get('category/:categoryId')
  @ApiResponse({ status: 200, type: BrandCategoriesResponseWrapper })
  async findByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    try {
      const mappings = await this.brandCategoryService.findByCategoryId(categoryId);
      
      return {
        success: true,
        message: 'Brand category mappings retrieved successfully',
        data: mappings,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand category mappings by category ID', error);
      throw error;
    }
  }

  @Get('brand/:brandId/primary')
  @ApiResponse({ status: 200, type: BrandCategoryResponseWrapper })
  async findPrimaryCategoryByBrandId(@Param('brandId', ParseIntPipe) brandId: number) {
    try {
      const mapping = await this.brandCategoryService.findPrimaryCategoryByBrandId(brandId);
      
      return {
        success: true,
        message: 'Primary category mapping retrieved successfully',
        data: mapping,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving primary category mapping', error);
      throw error;
    }
  }

  @Get('brands-by-category/:categoryId')
  @ApiResponse({ status: 200, type: BrandCategoriesResponseWrapper })
  async getBrandsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    try {
      const mappings = await this.brandCategoryService.getBrandsByCategory(categoryId);
      
      return {
        success: true,
        message: 'Brands by category retrieved successfully',
        data: mappings,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brands by category', error);
      throw error;
    }
  }

  @Get('categories-by-brand/:brandId')
  @ApiResponse({ status: 200, type: BrandCategoriesResponseWrapper })
  async getCategoriesByBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    try {
      const mappings = await this.brandCategoryService.getCategoriesByBrand(brandId);
      
      return {
        success: true,
        message: 'Categories by brand retrieved successfully',
        data: mappings,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving categories by brand', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: BrandCategoryResponseWrapper })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const mapping = await this.brandCategoryService.findById(id);
      
      return {
        success: true,
        message: 'Brand category mapping retrieved successfully',
        data: mapping,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand category mapping', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: BrandCategoryResponseWrapper })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandCategoryDto: UpdateBrandCategoryDto,
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const user = await this.commonUtilService.getUserById(userId);
      const mapping = await this.brandCategoryService.update(id, updateBrandCategoryDto, user);
      
      return {
        success: true,
        message: 'Brand category mapping updated successfully',
        data: mapping,
      };
    } catch (error) {
      this.loggerService.error('Error updating brand category mapping', error);
      throw error;
    }
  }

  @Patch('brand/:brandId/set-primary/:categoryId')
  @ApiResponse({ status: 200, description: 'Primary category set successfully' })
  async setPrimaryCategory(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    try {
      await this.brandCategoryService.setPrimaryCategory(brandId, categoryId);
      
      return {
        success: true,
        message: 'Primary category set successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error setting primary category', error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Brand category mapping deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.brandCategoryService.remove(id);
      
      return {
        success: true,
        message: 'Brand category mapping deleted successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error deleting brand category mapping', error);
      throw error;
    }
  }

  @Patch(':id/soft-delete')
  @ApiResponse({ status: 200, description: 'Brand category mapping soft deleted successfully' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.brandCategoryService.softDelete(id);
      
      return {
        success: true,
        message: 'Brand category mapping soft deleted successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error soft deleting brand category mapping', error);
      throw error;
    }
  }

  @Patch(':id/restore')
  @ApiResponse({ status: 200, description: 'Brand category mapping restored successfully' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.brandCategoryService.restore(id);
      
      return {
        success: true,
        message: 'Brand category mapping restored successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error restoring brand category mapping', error);
      throw error;
    }
  }
}
