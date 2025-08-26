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
import { BrandService } from '../service/brand.service';
import { CreateBrandDto } from '../dto/requests/brand/create-brand.dto';
import { UpdateBrandDto } from '../dto/requests/brand/update-brand.dto';
import { 
  BrandResponseWrapper, 
  BrandsResponseWrapper 
} from '../dto/responses/brand-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { Public } from '../commons/decorators/public.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';

@ApiTags('Brands')
@Controller('v1/brands')
@UseGuards(AuthGuard)
@ApiHeadersForAuth()
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: BrandResponseWrapper })
  async create(@Body() createBrandDto: CreateBrandDto, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const user = await this.commonUtilService.getUserById(userId);
      
      const brand = await this.brandService.create(createBrandDto, user);
      
      return {
        success: true,
        message: 'Brand created successfully',
        data: brand,
      };
    } catch (error) {
      this.loggerService.error('Error creating brand', error);
      throw error;
    }
  }

  @Get()
  @Public()
  @ApiResponse({ status: 200, type: BrandsResponseWrapper })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'withProducts', required: false, description: 'Include products in response' })
  async findAll(
    @Query('active') active?: string,
    @Query('withProducts') withProducts?: string,
  ) {
    try {
      let brands;
      
      if (active === 'true') {
        brands = await this.brandService.findActive();
      } else if (withProducts === 'true') {
        brands = await this.brandService.findWithProducts();
      } else {
        brands = await this.brandService.findAll();
      }

      return {
        success: true,
        message: 'Brands retrieved successfully',
        data: brands,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brands', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiResponse({ status: 200, description: 'Brand statistics' })
  async getStats() {
    try {
      const stats = await this.brandService.getBrandStats();
      
      return {
        success: true,
        message: 'Brand statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand stats', error);
      throw error;
    }
  }

  @Get('my-brands')
  @ApiResponse({ status: 200, type: BrandsResponseWrapper })
  async findMyBrands(@Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const brands = await this.brandService.findByUserId(userId);
      
      return {
        success: true,
        message: 'User brands retrieved successfully',
        data: brands,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving user brands', error);
      throw error;
    }
  }

  @Get('search/:name')
  @Public()
  @ApiResponse({ status: 200, type: BrandResponseWrapper })
  async findByName(@Param('name') name: string) {
    try {
      const brand = await this.brandService.findByName(name);
      
      return {
        success: true,
        message: 'Brand found successfully',
        data: brand,
      };
    } catch (error) {
      this.loggerService.error('Error finding brand by name', error);
      throw error;
    }
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, type: BrandResponseWrapper })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const brand = await this.brandService.findOne(id);
      
      return {
        success: true,
        message: 'Brand retrieved successfully',
        data: brand,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving brand', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: BrandResponseWrapper })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const user = await this.commonUtilService.getUserById(userId);
      
      const brand = await this.brandService.update(id, updateBrandDto, user);
      
      return {
        success: true,
        message: 'Brand updated successfully',
        data: brand,
      };
    } catch (error) {
      this.loggerService.error('Error updating brand', error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.brandService.remove(id);
      
      return {
        success: true,
        message: 'Brand deleted successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error deleting brand', error);
      throw error;
    }
  }

  @Patch(':id/soft-delete')
  @ApiResponse({ status: 200, description: 'Brand soft deleted successfully' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.brandService.softDelete(id);
      
      return {
        success: true,
        message: 'Brand soft deleted successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error soft deleting brand', error);
      throw error;
    }
  }

  @Patch(':id/restore')
  @ApiResponse({ status: 200, description: 'Brand restored successfully' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.brandService.restore(id);
      
      return {
        success: true,
        message: 'Brand restored successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error restoring brand', error);
      throw error;
    }
  }
}
