import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/requests/product/create-product.dto';
import { UpdateProductDto } from '../dto/requests/product/update-product.dto';
import { ProductByBrandsDto } from '../dto/requests/product/product-by-brands.dto';
import { ProductResponseDto } from '../dto/responses/product-response.dto';
import { ProductsWithPaginationResponseWrapper } from '../dto/responses/product-with-pagination-response.dto';
import { PRODUCT_RESPONSES } from '../commons/constants/response-constants/product.constant';
import { LoggerService } from '../service/logger.service';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { AuthGuard } from '../commons/guards/auth.guard';
import { Public } from '../commons/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { S3Service } from '../service/s3.service';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { RolesGuard } from '../commons/guards/roles.guard';
import { Roles } from '../commons/enumerations/role.enum';

@ApiTags('products')
@Controller('v1/products')
// @UseGuards(AuthGuard)
// @ApiHeadersForAuth()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly loggerService: LoggerService,
    private readonly s3Service: S3Service,
  ) {}


  @Post()
  @Public()
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto) {
    try {
      const result = await this.productService.create(dto);
      return PRODUCT_RESPONSES.PRODUCT_CREATED(result);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Post('upload-images')
  @Public()
  @UseInterceptors(FilesInterceptor('files', 10, { storage: multer.memoryStorage() }))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls: string[] = [];
    for (const file of files || []) {
      const { url } = await this.s3Service.uploadBuffer({
        buffer: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
        keyPrefix: 'products',
        acl: 'public-read',
      });
      urls.push(url);
    }
    return { success: true, data: { urls } };
  }

  @Get()
  @Public()
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability' })
  async findAll(
    @Query('brandId') brandId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('categoryId') categoryId?: string,
    @Query('inStock') inStock?: string,
  ) {
    try {
      const filters = {
        brandId: brandId ? parseInt(brandId) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        inStock: inStock ? inStock === 'true' : undefined,
      };
      
      return await this.productService.getProductsWithFilters(filters);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200 })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body('approvedBy') approvedBy: number,
  ) {
    try {
      const approver = await this.productService['userRepo'].findUserById(approvedBy);
      const product = await this.productService['repo'].findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      product.isApproved = true;
      product.approvedBy = approver as any;
      product.approvedAt = new Date();
      await this.productService['repo'].save(product as any);
      return { success: true, message: 'Product approved' };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('filter')
  @Public()
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field (price, name, createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc, desc)' })
  async filterProducts(
    @Query('brandId') brandId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('categoryId') categoryId?: string,
    @Query('inStock') inStock?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    try {
      const filters = {
        brandId: brandId ? parseInt(brandId) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        inStock: inStock ? inStock === 'true' : undefined,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc',
      };
      
      return await this.productService.getProductsWithFilters(filters);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('brand/:brandId')
  @Public()
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability' })
  async getProductsByBrand(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
  ) {
    try {
      const filters = {
        brandId,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        inStock: inStock ? inStock === 'true' : undefined,
      };
      
      return await this.productService.getProductsWithFilters(filters);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Post('by-brands-in-category')
  @Public()
  @ApiResponse({ status: 200, type: ProductsWithPaginationResponseWrapper })
  async getProductsByBrandsInCategory(@Body() productByBrandsDto: ProductByBrandsDto) {
    try {
      return await this.productService.getProductsByBrandsInCategory(productByBrandsDto);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    try {
      const result = await this.productService.update(id, dto);
      return result;
    } catch (error) {
      this.loggerService.error( error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.productService.delete(id);
      return result;
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
