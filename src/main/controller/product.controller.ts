import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiOperation } from '@nestjs/swagger';

import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/requests/product/create-product.dto';
import { UpdateProductDto } from '../dto/requests/product/update-product.dto';
import { ProductByBrandsDto } from '../dto/requests/product/product-by-brands.dto';
import { ApproveProductDto, RejectProductDto } from '../dto/requests/product/approve-product.dto';
import { CreateProductVariantDto } from '../dto/requests/product/create-product-variant.dto';
import { ProductResponseDto, FrontendVariantsResponseWrapper } from '../dto/responses/product-response.dto';
import { ProductsWithPaginationResponseWrapper } from '../dto/responses/product-with-pagination-response.dto';
import { PRODUCT_RESPONSES } from '../commons/constants/response-constants/product.constant';
import { LoggerService } from '../service/logger.service';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { AuthGuard } from '../commons/guards/auth.guard';
import { Public } from '../commons/decorators/public.decorator';
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
  ) {}


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.VENDOR, Roles.ADMIN)
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    try {
      // Extract user ID from request headers
      const userId = req.headers['user-id'];
      if (!userId) {
        throw new Error('User ID not found in request headers');
      }
      
      // Set the createdBy field from the authenticated user
      dto.createdBy = parseInt(userId);
      
      const result = await this.productService.create(dto);
      return result;
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
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
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveDto: ApproveProductDto,
  ) {
    try {
      return await this.productService.approveProduct(id, approveDto.approvedBy);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() rejectDto: RejectProductDto,
  ) {
    try {
      return await this.productService.rejectProduct(id, rejectDto.rejectedBy, rejectDto.rejectionReason);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('pending-approval')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async getPendingApprovalProducts() {
    try {
      return await this.productService.getPendingApprovalProducts();
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('approved')
  @Public()
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async getApprovedProducts() {
    try {
      return await this.productService.getApprovedProducts();
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('vendor/:vendorId')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.VENDOR, Roles.ADMIN)
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @ApiQuery({ name: 'includePending', required: false, description: 'Include pending approval products' })
  async getVendorProducts(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Query('includePending') includePending?: string,
  ) {
    try {
      const includePendingBool = includePending === 'true';
      return await this.productService.getVendorProducts(vendorId, includePendingBool);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('vendor/:vendorId/approved')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.VENDOR, Roles.ADMIN)
  @ApiOperation({ summary: 'Get approved products for a vendor' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async getVendorApprovedProducts(@Param('vendorId', ParseIntPipe) vendorId: number) {
    try {
      return await this.productService.getVendorApprovedProducts(vendorId);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('vendor/:vendorId/pending')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.VENDOR, Roles.ADMIN)
  @ApiOperation({ summary: 'Get pending (not approved) products for a vendor' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async getVendorPendingProducts(@Param('vendorId', ParseIntPipe) vendorId: number) {
    try {
      return await this.productService.getVendorPendingProducts(vendorId);
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
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      const userId = req.headers['user-id'] ? parseInt(req.headers['user-id']) : undefined;
      const userRole = req.headers['user-role'];
      
      return await this.productService.findOne(id, userId, userRole);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  

  

  

  @Post(':id/variants')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Variants created successfully' })
  @ApiOperation({ summary: 'Create variants for an existing product' })
  async createVariants(
    @Param('id', ParseIntPipe) productId: number,
    @Body() variants: CreateProductVariantDto[],
    @Req() req: any,
  ) {
    try {
      const userId = parseInt(req.headers['user-id']);
      await this.productService.createProductVariants(productId, variants, userId);
      return { message: 'Variants created successfully' };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get(':id/variants')
  @Public()
  @ApiResponse({ status: 200, description: 'Product variants retrieved successfully' })
  @ApiOperation({ summary: 'Get all variants for a product' })
  async getProductVariants(@Param('id', ParseIntPipe) productId: number) {
    try {
      const result = await this.productService.getProductVariants(productId);
      return result;
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get(':id/variants/frontend')
  @Public()
  @ApiResponse({ status: 200, type: FrontendVariantsResponseWrapper, description: 'Product variants retrieved successfully for frontend' })
  @ApiOperation({ summary: 'Get product variants in frontend-friendly format with grouped attributes' })
  async getProductVariantsForFrontend(@Param('id', ParseIntPipe) productId: number) {
    try {
      return await this.productService.getProductVariantsForFrontend(productId);
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get(':id/variant-availability')
  @Public()
  @ApiOperation({ summary: 'Get available attribute values for a product based on current selections' })
  @ApiQuery({ name: 'selected', required: false, description: 'JSON array: [{attributeId, attributeValueId}]' })
  async getVariantAvailability(
    @Param('id', ParseIntPipe) productId: number,
    @Query('selected') selected?: string,
  ) {
    try {
      let selectedArr: Array<{ attributeId: number; attributeValueId: number }> | undefined;
      if (selected) {
        try {
          const parsed = JSON.parse(selected);
          if (Array.isArray(parsed)) selectedArr = parsed;
        } catch {}
      }
      return await this.productService.getVariantAvailability(productId, selectedArr);
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
