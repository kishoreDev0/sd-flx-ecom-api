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
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/requests/product/create-product.dto';
import { UpdateProductDto } from '../dto/requests/product/update-product.dto';
import { ProductResponseDto } from '../dto/responses/product-response.dto';
import { PRODUCT_RESPONSES } from '../commons/constants/response-constants/product.constant';
import { LoggerService } from '../service/logger.service';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { AuthGuard } from '../commons/guards/auth.guard';
import { Public } from '../commons/decorators/public.decorator';

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

  @Get()
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll() {
    try {
      return await this.productService.getAllProducts();
    } catch (error) {
      this.loggerService.error( error);
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
