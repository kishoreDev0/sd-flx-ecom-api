import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CategoryRepository } from '../repository/category.repository';
import { UserRepository } from '../repository/user.repository';
import { CreateProductDto } from '../dto/requests/product/create-product.dto';
import { UpdateProductDto } from '../dto/requests/product/update-product.dto';
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
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseWrapper> {
    try {
      const creator = await this.userRepo.findUserById(dto.createdBy);
      const category = await this.categoryRepo.findById(dto.categoryId);

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

      Object.assign(product, dto, {
        updatedBy: updater,
        category,
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
