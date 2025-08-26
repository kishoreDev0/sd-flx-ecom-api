import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from 'src/main/entities/product.entity';
import { LoggerService } from '../service/logger.service';
import { ProductFilterDto } from '../dto/requests/product/product-filter.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private readonly logger: LoggerService,
  ) {}

  create(data: Partial<Product>): Product {
    return this.repository.create(data);
  }

  async save(product: Product): Promise<Product> {
    try {
      return await this.repository.save(product);
    } catch (error) {
      this.logger.error(   error);
      throw error;
    }
  }

  async findById(id: number): Promise<Product | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ['category', 'brand', 'createdBy', 'updatedBy'],
      });
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      return await this.repository.find({
        relations: ['category', 'brand', 'createdBy', 'updatedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }

  async getProductsWithFilters(filters: ProductFilterDto): Promise<Product[]> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.createdBy', 'createdBy')
        .leftJoinAndSelect('product.updatedBy', 'updatedBy');

      // Apply filters
      if (filters.brandId) {
        queryBuilder.andWhere('brand.id = :brandId', { brandId: filters.brandId });
      }

      if (filters.categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters.inStock !== undefined) {
        queryBuilder.andWhere('product.inStock = :inStock', { inStock: filters.inStock });
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'DESC';
      
      // Map sortBy to actual column names
      const sortColumnMap = {
        price: 'product.price',
        name: 'product.name',
        createdAt: 'product.createdAt',
        updatedAt: 'product.updatedAt',
      };

      const sortColumn = sortColumnMap[sortBy] || 'product.createdAt';
      queryBuilder.orderBy(sortColumn, sortOrder as 'ASC' | 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Error filtering products', error);
      throw error;
    }
  }

  async getProductsByBrand(brandId: number, filters?: Partial<ProductFilterDto>): Promise<Product[]> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.createdBy', 'createdBy')
        .leftJoinAndSelect('product.updatedBy', 'updatedBy')
        .where('brand.id = :brandId', { brandId });

      // Apply additional filters
      if (filters?.minPrice !== undefined) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters?.maxPrice !== undefined) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters?.inStock !== undefined) {
        queryBuilder.andWhere('product.inStock = :inStock', { inStock: filters.inStock });
      }

      // Apply sorting
      const sortBy = filters?.sortBy || 'createdAt';
      const sortOrder = filters?.sortOrder || 'DESC';
      
      const sortColumnMap = {
        price: 'product.price',
        name: 'product.name',
        createdAt: 'product.createdAt',
        updatedAt: 'product.updatedAt',
      };

      const sortColumn = sortColumnMap[sortBy] || 'product.createdAt';
      queryBuilder.orderBy(sortColumn, sortOrder as 'ASC' | 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Error getting products by brand', error);
      throw error;
    }
  }

  async getProductsByBrandsInCategory(
    categoryId: number, 
    brandIds: number[], 
    filters?: Partial<ProductFilterDto>,
    page: number = 1,
    limit: number = 10
  ): Promise<{ products: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.vendor', 'vendor')
        .leftJoinAndSelect('product.createdBy', 'createdBy')
        .leftJoinAndSelect('product.updatedBy', 'updatedBy')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('brand.id IN (:...brandIds)', { brandIds });

      // Apply additional filters
      if (filters?.minPrice !== undefined) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters?.maxPrice !== undefined) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters?.inStock !== undefined) {
        queryBuilder.andWhere('product.inStock = :inStock', { inStock: filters.inStock });
      }

      // Apply sorting
      const sortBy = filters?.sortBy || 'createdAt';
      const sortOrder = filters?.sortOrder || 'DESC';
      
      const sortColumnMap = {
        price: 'product.price',
        name: 'product.name',
        createdAt: 'product.createdAt',
        updatedAt: 'product.updatedAt',
      };

      const sortColumn = sortColumnMap[sortBy] || 'product.createdAt';
      queryBuilder.orderBy(sortColumn, sortOrder as 'ASC' | 'DESC');

      // Get total count for pagination
      const totalQueryBuilder = this.repository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.brand', 'brand')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('brand.id IN (:...brandIds)', { brandIds });

      // Apply same filters to count query
      if (filters?.minPrice !== undefined) {
        totalQueryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters?.maxPrice !== undefined) {
        totalQueryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters?.inStock !== undefined) {
        totalQueryBuilder.andWhere('product.inStock = :inStock', { inStock: filters.inStock });
      }

      const total = await totalQueryBuilder.getCount();

      // Apply pagination
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      const products = await queryBuilder.getMany();
      const totalPages = Math.ceil(total / limit);

      return {
        products,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error getting products by brands in category', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.logger.error( error);
      throw error;
    }
  }
}
