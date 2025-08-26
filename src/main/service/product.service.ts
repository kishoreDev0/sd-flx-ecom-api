import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CategoryRepository } from '../repository/category.repository';
import { BrandRepository } from '../repository/brand.repository';
import { VendorRepository } from '../repository/vendor.repository';
import { BrandCategoryRepository } from '../repository/brand-category.repository';
import { UserRepository } from '../repository/user.repository';
import { CreateProductDto } from '../dto/requests/product/create-product.dto';
import { UpdateProductDto } from '../dto/requests/product/update-product.dto';
import { ProductFilterDto } from '../dto/requests/product/product-filter.dto';
import { ProductByBrandsDto } from '../dto/requests/product/product-by-brands.dto';
import {
  ProductResponseWrapper,
  ProductsResponseWrapper,
} from '../dto/responses/product-response.dto';
import { PRODUCT_RESPONSES } from '../commons/constants/response-constants/product.constant';
import { LoggerService } from './logger.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly repo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly brandRepo: BrandRepository,
    private readonly vendorRepo: VendorRepository,
    private readonly brandCategoryRepo: BrandCategoryRepository,
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseWrapper> {
    try {
      const creator = await this.userRepo.findUserById(dto.createdBy);
      const category = await this.categoryRepo.findById(dto.categoryId);
      
      let brand = null;
      if (dto.brandId) {
        brand = await this.brandRepo.findBrandById(dto.brandId);
      }

      let vendor = null;
      if (dto.vendorId) {
        vendor = await this.vendorRepo.findVendorById(dto.vendorId);
      }

      const product = this.repo.create({
        name: dto.name,
        description: dto.description,
        features: dto.features,
        imagesPath: dto.imagesPath || [],
        price: dto.price,
        inStock: dto.inStock ?? true,
        noOfStock: dto.noOfStock,
        totalNoOfStock:dto.totalNoOfStock,
        category,
        brand,
        vendor,
        createdBy: creator,
        updatedBy: creator,
      });

      const savedProduct = await this.repo.save(product);
      return PRODUCT_RESPONSES.PRODUCT_CREATED(savedProduct);
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseWrapper> {
    try {
      const product = await this.repo.findById(id);
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      const updater = await this.userRepo.findUserById(dto.updatedBy);
      const category = dto.categoryId ? await this.categoryRepo.findById(dto.categoryId) : product.category;
      
      let brand = product.brand;
      if (dto.brandId) {
        brand = await this.brandRepo.findBrandById(dto.brandId);
      }

      Object.assign(product, dto, {
        updatedBy: updater,
        category,
        brand,
      });

      const updatedProduct = await this.repo.save(product);
      return PRODUCT_RESPONSES.PRODUCT_UPDATED(updatedProduct);
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ProductResponseWrapper> {
    try {
      const product = await this.repo.findById(id);
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      return PRODUCT_RESPONSES.PRODUCT_BY_ID_FETCHED(product, id);
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }

  async getAllProducts(): Promise<ProductsResponseWrapper> {
    try {
      const products = await this.repo.getAll();
      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProductsWithFilters(filters: ProductFilterDto): Promise<ProductsResponseWrapper> {
    try {
      const products = await this.repo.getProductsWithFilters(filters);
      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error filtering products', error);
      throw error;
    }
  }

  async getProductsByBrand(brandId: number, filters?: Partial<ProductFilterDto>): Promise<ProductsResponseWrapper> {
    try {
      // Verify brand exists
      const brand = await this.brandRepo.findBrandById(brandId);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      const products = await this.repo.getProductsByBrand(brandId, filters);
      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error getting products by brand', error);
      throw error;
    }
  }

  async getProductsByBrandsInCategory(productByBrandsDto: ProductByBrandsDto): Promise<ProductsResponseWrapper> {
    try {
      // Verify category exists
      const category = await this.categoryRepo.findById(productByBrandsDto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Verify all brands exist
      for (const brandId of productByBrandsDto.brandIds) {
        const brand = await this.brandRepo.findBrandById(brandId);
        if (!brand) {
          throw new NotFoundException(`Brand with ID ${brandId} not found`);
        }
      }

      // Verify brands belong to the specified category through brand-category mapping
      const brandCategoryMappings = await this.brandCategoryRepo.findByCategoryId(productByBrandsDto.categoryId);
      const validBrandIds = brandCategoryMappings.map(mapping => mapping.brandId);
      
      const invalidBrandIds = productByBrandsDto.brandIds.filter(brandId => !validBrandIds.includes(brandId));
      if (invalidBrandIds.length > 0) {
        throw new NotFoundException(`Brands with IDs [${invalidBrandIds.join(', ')}] are not associated with category ${productByBrandsDto.categoryId}`);
      }

      const filters = {
        minPrice: productByBrandsDto.minPrice,
        maxPrice: productByBrandsDto.maxPrice,
        inStock: productByBrandsDto.inStock,
        sortBy: productByBrandsDto.sortBy,
        sortOrder: productByBrandsDto.sortOrder,
      };

      const page = productByBrandsDto.page || 1;
      const limit = productByBrandsDto.limit || 10;

      const result = await this.repo.getProductsByBrandsInCategory(
        productByBrandsDto.categoryId,
        productByBrandsDto.brandIds,
        filters,
        page,
        limit
      );

      if (!result.products.length) {
        return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();
      }

      // Map products to response DTOs
      const productDtos = result.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imagesPath: product.imagesPath,
        category: product.category?.id || 0,
        brand: product.brand?.id,
        features: product.features?.map(f => f.toString()) || [],
        price: product.price,
        totalNoOfStock: product.totalNoOfStock,
        noOfStock: product.noOfStock,
        inStock: product.inStock,
        createdBy: product.createdBy?.id || 0,
        updatedBy: product.updatedBy?.id || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      // Create custom response with pagination info
      return {
        success: true,
        message: 'Products retrieved successfully',
        data: productDtos,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      } as any;
    } catch (error) {
      this.logger.error('Error getting products by brands in category', error);
      throw error;
    }
  }

  async delete(id: number): Promise<ProductResponseWrapper> {
    try {
      const product = await this.repo.findById(id);
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      await this.repo.delete(id);
      return PRODUCT_RESPONSES.PRODUCT_DELETED(id);
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }
}
