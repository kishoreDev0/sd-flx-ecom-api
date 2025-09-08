import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductFeature } from '../entities/product-feature.entity';
import { ProductAttribute } from '../entities/product-attribute.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Feature } from '../entities/feature.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../entities/user.entity';
import { CreateProductDto } from '../dto/requests/product/create-product.dto';
import { UpdateProductDto } from '../dto/requests/product/update-product.dto';
import { ProductFilterDto } from '../dto/requests/product/product-filter.dto';
import { ProductByBrandsDto } from '../dto/requests/product/product-by-brands.dto';
import { ProductResponseWrapper, ProductsResponseWrapper, FrontendVariantsResponseWrapper } from '../dto/responses/product-response.dto';
import { ProductsWithPaginationResponseWrapper } from '../dto/responses/product-with-pagination-response.dto';
import { PRODUCT_RESPONSES } from '../commons/constants/response-constants/product.constant';
import { LoggerService } from './logger.service';
import { CreateProductVariantDto } from '../dto/requests/product/create-product-variant.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductFeature)
    private readonly productFeatureRepo: Repository<ProductFeature>,
    @InjectRepository(ProductAttribute)
    private readonly productAttributeRepo: Repository<ProductAttribute>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Feature)
    private readonly featureRepo: Repository<Feature>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseWrapper> {
    try {
      // Validate that the creator user exists and has the 'Vendor' role
      const creator = await this.userRepo.findOne({ where: { id: dto.createdBy }, relations: ['role'] });
      if (!creator) {
        throw new NotFoundException('Creator user not found');
      }
      const creatorRole = (creator.role?.roleName || '').toLowerCase();
      const isVendor = creatorRole === 'vendor';
      const isAdmin = creatorRole === 'admin';
      if (!isVendor && !isAdmin) {
        throw new Error('Only vendors or admins can create products');
      }

      // Validate category exists
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Validate brand exists if provided
      let brand = undefined;
      if (dto.brandId) {
        brand = await this.brandRepo.findOne({ where: { id: dto.brandId } });
        if (!brand) {
          throw new NotFoundException('Brand not found');
        }
      }

      // Validate vendor exists and is verified
      let vendor = undefined;
      if (isVendor) {
        if (dto.vendorId) {
          vendor = await this.vendorRepo.findOne({ where: { id: dto.vendorId }, relations: ['user'] });
          if (!vendor) throw new NotFoundException('Vendor not found');
          if (!vendor.isVerified) throw new Error('Vendor must be verified to create products');
          if (vendor.user.id !== creator.id) throw new Error('Vendor ID must match the creator user');
        } else {
          vendor = await this.vendorRepo.findOne({ where: { user: { id: creator.id } }, relations: ['user'] });
          if (!vendor) throw new Error('Vendor not found for this user');
          if (!vendor.isVerified) throw new Error('Vendor must be verified to create products');
        }
      } else if (isAdmin) {
        if (!dto.vendorId) throw new Error('Admin must specify vendorId when creating products');
        vendor = await this.vendorRepo.findOne({ where: { id: dto.vendorId }, relations: ['user'] });
        if (!vendor) throw new NotFoundException('Vendor not found');
        if (!vendor.isVerified) throw new Error('Vendor must be verified to create products');
      }

      // Create the product
      const product = this.productRepo.create({
        name: dto.name,
        description: dto.description,
        imagesPath: dto.imagesPath,
        features: dto.features || [],
        price: dto.price,
        totalNoOfStock: dto.totalNoOfStock,
        noOfStock: dto.noOfStock,
        inStock: dto.inStock,
        isApproved: false, // Products need admin approval by default
        category,
        brand,
        vendor,
        createdBy: creator,
        updatedBy: creator,
      });

      const savedProduct = await this.productRepo.save(product);

      // Create feature mappings if features are provided
      if (dto.features && dto.features.length > 0) {
        await this.productFeatureRepo.save(dto.features.map(featureId => ({
          product: savedProduct,
          feature: { id: featureId } as Feature,
        })));
      }

      // Product-level attributes removed; attributes are handled per-variant

      // Create variants if provided
      if (dto.variants && dto.variants.length > 0) {
        await this.createProductVariants(savedProduct.id, dto.variants, creator.id);
      }

      return PRODUCT_RESPONSES.PRODUCT_CREATED(savedProduct);
    } catch (error) {
      this.logger.error('Error creating product', error);
      throw error;
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseWrapper> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      // Map DTO fields to entity fields
      const updateData: any = {};
      
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.imagesPath !== undefined) updateData.imagesPath = dto.imagesPath;
      if (dto.features !== undefined) updateData.features = dto.features;
      if (dto.price !== undefined) updateData.price = dto.price;
      if (dto.totalNoOfStock !== undefined) updateData.totalNoOfStock = dto.totalNoOfStock;
      if (dto.noOfStock !== undefined) updateData.noOfStock = dto.noOfStock;
      if (dto.inStock !== undefined) updateData.inStock = dto.inStock;

      // Update the product
      const updatedProduct = await this.productRepo.save({ ...product, ...updateData });

      return PRODUCT_RESPONSES.PRODUCT_UPDATED(updatedProduct);
    } catch (error) {
      this.logger.error('Error updating product', error);
      throw error;
    }
  }

  

  async createProductVariants(
    productId: number, 
    variants: CreateProductVariantDto[], 
    userId: number
  ): Promise<void> {
    try {
      for (const variant of variants) {
        // Create the variant
        const productVariant = this.productVariantRepo.create({
          productId,
          sku: variant.sku,
          name: variant.name,
          price: variant.price,
          stock: variant.stock,
          barcode: variant.barcode,
          weight: variant.weight,
          dimensions: variant.dimensions,
          variantImages: variant.variantImages ? JSON.stringify(variant.variantImages) : null,
          isActive: variant.isActive ?? true,
          sortOrder: variant.sortOrder ?? 0,
          createdBy: { id: userId },
          updatedBy: { id: userId },
        });

        const savedVariant = await this.productVariantRepo.save(productVariant);

        // Link variant to specific product attributes
        if (variant.attributes && variant.attributes.length > 0) {
          // Find or create the product attributes for this variant
          const productAttributes = [];
          for (const attr of variant.attributes) {
            // Check if this product attribute already exists
            let productAttribute = await this.productAttributeRepo.findOne({
              where: {
                productId,
                attributeId: attr.attributeId,
                attributeValueId: attr.attributeValueId,
              }
            });

            // If it doesn't exist, create it
            if (!productAttribute) {
              productAttribute = this.productAttributeRepo.create({
                productId,
                attributeId: attr.attributeId,
                attributeValueId: attr.attributeValueId,
                customValue: attr.customValue,
                createdBy: { id: userId },
                updatedBy: { id: userId },
              });
              productAttribute = await this.productAttributeRepo.save(productAttribute);
            }

            productAttributes.push(productAttribute);
          }

          // Link the variant to these product attributes
          savedVariant.attributes = productAttributes;
          await this.productVariantRepo.save(savedVariant);
        }
      }
    } catch (error) {
      this.logger.error('Error creating product variants', error);
      throw error;
    }
  }

  async findOne(id: number, userId?: number, userRole?: string): Promise<ProductResponseWrapper> {
    try {
      const product = await this.productRepo.findOne({ 
        where: { id },
        relations: ['variants', 'variants.attributes', 'variants.attributes.attribute', 'variants.attributes.attributeValue']
      });
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      // Check if user can see this product based on approval status and role
      if (!product.isApproved && userRole !== 'Admin' && userRole !== 'Vendor') {
        throw new NotFoundException('Product not found or not approved');
      }

      // If user is vendor, check if they own this product
      if (userRole === 'Vendor' && userId && product.createdBy?.id !== userId) {
        throw new NotFoundException('Product not found');
      }

      // Get variants data (using same structure as getProductVariants)
      const variants = product.variants?.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        barcode: variant.barcode,
        weight: variant.weight,
        dimensions: variant.dimensions,
        variantImages: variant.variantImages,
        isActive: variant.isActive,
        sortOrder: variant.sortOrder,
        attributes: variant.attributes?.map(attr => ({
          id: attr.id,
          attribute: {
            id: attr.attribute.id,
            name: attr.attribute.name,
            type: attr.attribute.type,
          },
          attributeValue: {
            id: attr.attributeValue.id,
            value: attr.attributeValue.value,
            displayName: attr.attributeValue.displayName,
          },
        })) || [],
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt,
      })) || [];

      // Create custom response with variants
      const response = {
        success: true,
        message: `Product with ID ${id} fetched successfully`,
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          imagesPath: product.imagesPath,
          category: product.category ? {
            id: product.category.id,
            categoryName: product.category.categoryName,
            description: product.category.description,
          } : undefined,
          brand: product.brand ? {
            id: product.brand.id,
            brandName: product.brand.brandName,
            description: product.brand.brandDescription,
          } : undefined,
          vendor: product.vendor ? {
            id: product.vendor.id,
            vendorName: product.vendor.vendorName,
            businessName: product.vendor.businessName,
            isVerified: product.vendor.isVerified,
          } : undefined,
          features: [], // Features are not directly fetched here
          price: product.price,
          totalNoOfStock: product.totalNoOfStock,
          noOfStock: product.noOfStock,
          inStock: product.inStock,
          isApproved: product.isApproved,
          approvedBy: product.approvedBy ? {
            id: product.approvedBy.id,
            firstName: product.approvedBy.firstName,
            lastName: product.approvedBy.lastName,
            email: product.approvedBy.officialEmail,
          } : undefined,
          approvedAt: product.approvedAt,
          createdBy: product.createdBy ? {
            id: product.createdBy.id,
            firstName: product.createdBy.firstName,
            lastName: product.createdBy.lastName,
            email: product.createdBy.officialEmail,
          } : undefined,
          updatedBy: product.updatedBy ? {
            id: product.updatedBy.id,
            firstName: product.updatedBy.firstName,
            lastName: product.updatedBy.lastName,
            email: product.updatedBy.officialEmail,
          } : undefined,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          variants: variants,
        },
      };

      return response;
    } catch (error) {
      this.logger.error('Error finding product', error);
      throw error;
    }
  }

  async getAllProducts(): Promise<ProductsResponseWrapper> {
    try {
      const products = await this.productRepo.find();
      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error getting all products', error);
      throw error;
    }
  }

  async getProductsWithFilters(filters: ProductFilterDto): Promise<ProductsResponseWrapper> {
    try {
      const whereConditions: any = {};
      
      if (filters.name) {
        whereConditions.name = Like(`%${filters.name}%`);
      }
      if (filters.brandId) {
        whereConditions.brand = { id: filters.brandId };
      }
      if (filters.vendorId) {
        whereConditions.vendor = { id: filters.vendorId };
      }
      if (filters.categoryId) {
        whereConditions.category = { id: filters.categoryId };
      }
      if (filters.inStock !== undefined) {
        whereConditions.inStock = filters.inStock;
      }

      const products = await this.productRepo.find({
        where: whereConditions,
        relations: ['category', 'brand', 'vendor', 'createdBy', 'updatedBy', 'approvedBy'],
        order: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
        },
        skip: ((filters.page || 1) - 1) * (filters.limit || 10),
        take: filters.limit || 10,
      });

      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error getting products with filters', error);
      throw error;
    }
  }

  async getProductsByBrand(brandId: number, filters?: Partial<ProductFilterDto>): Promise<ProductsResponseWrapper> {
    try {
      const whereConditions: any = { brand: { id: brandId } };
      
      if (filters?.inStock !== undefined) {
        whereConditions.inStock = filters.inStock;
      }

      const products = await this.productRepo.find({
        where: whereConditions,
        relations: ['category', 'brand', 'vendor', 'createdBy', 'updatedBy', 'approvedBy'],
        order: {
          [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc',
        },
        skip: ((filters?.page || 1) - 1) * (filters?.limit || 10),
        take: filters?.limit || 10,
      });

      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error getting products by brand', error);
      throw error;
    }
  }

  async getProductsByBrandsInCategory(productByBrandsDto: ProductByBrandsDto): Promise<ProductsWithPaginationResponseWrapper> {
    try {
      const page = productByBrandsDto.page || 1;
      const limit = productByBrandsDto.limit || 10;

      const filters = {
        minPrice: productByBrandsDto.minPrice,
        maxPrice: productByBrandsDto.maxPrice,
        inStock: productByBrandsDto.inStock,
        sortBy: productByBrandsDto.sortBy || 'createdAt',
        sortOrder: productByBrandsDto.sortOrder || 'desc',
      };

      const products = await this.productRepo.find({
        where: {
          category: { id: productByBrandsDto.categoryId },
          brand: { id: In(productByBrandsDto.brandIds) },
          isApproved: true, // Only approved products for this specific query
        },
        relations: ['category', 'brand', 'vendor', 'createdBy', 'updatedBy', 'approvedBy'],
        order: {
          [filters.sortBy]: filters.sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!products.length) {
        return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();
      }

      // Map products to response DTOs
      const productDtos = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imagesPath: product.imagesPath,
        category: product.category ? {
          id: product.category.id,
          categoryName: product.category.categoryName,
          description: product.category.description,
        } : undefined,
        brand: product.brand ? {
          id: product.brand.id,
          brandName: product.brand.brandName,
          description: product.brand.brandDescription,
        } : undefined,
        vendor: product.vendor ? {
          id: product.vendor.id,
          vendorName: product.vendor.vendorName,
          businessName: product.vendor.businessName,
          isVerified: product.vendor.isVerified,
        } : undefined,
        features: [], // Features are not directly fetched here, they are in productFeatures
        price: product.price,
        totalNoOfStock: product.totalNoOfStock,
        noOfStock: product.noOfStock,
        inStock: product.inStock,
        isApproved: product.isApproved,
        approvedBy: product.approvedBy ? {
          id: product.approvedBy.id,
          firstName: product.approvedBy.firstName,
          lastName: product.approvedBy.lastName,
          email: product.approvedBy.officialEmail,
        } : undefined,
        approvedAt: product.approvedAt,
        createdBy: product.createdBy ? {
          id: product.createdBy.id,
          firstName: product.createdBy.firstName,
          lastName: product.createdBy.lastName,
          email: product.createdBy.officialEmail,
        } : undefined,
        updatedBy: product.updatedBy ? {
          id: product.updatedBy.id,
          firstName: product.updatedBy.firstName,
          lastName: product.updatedBy.lastName,
          email: product.updatedBy.officialEmail,
        } : undefined,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      // Create custom response with pagination info
      return {
        success: true,
        message: 'Products retrieved successfully',
        data: productDtos,
        pagination: {
          total: products.length, // This will be inaccurate without total count
          page: page,
          limit: limit,
          totalPages: Math.ceil(products.length / limit), // This will be inaccurate
        },
      } as any;
    } catch (error) {
      this.logger.error('Error getting products by brands in category', error);
      throw error;
    }
  }

  async delete(id: number): Promise<ProductResponseWrapper> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      await this.productRepo.delete(id);
      
      // Create a proper response object for deleted product
      const response = {
        success: true,
        message: `Product with ID ${product.id} deleted successfully`,
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          imagesPath: product.imagesPath,
          category: product.category ? {
            id: product.category.id,
            categoryName: product.category.categoryName,
            description: product.category.description,
          } : undefined,
          brand: product.brand ? {
            id: product.brand.id,
            brandName: product.brand.brandName,
            description: product.brand.brandDescription,
          } : undefined,
          vendor: product.vendor ? {
            id: product.vendor.id,
            vendorName: product.vendor.vendorName,
            businessName: product.vendor.businessName,
            isVerified: product.vendor.isVerified,
          } : undefined,
          features: [],
          price: product.price,
          totalNoOfStock: product.totalNoOfStock,
          noOfStock: product.noOfStock,
          inStock: product.inStock,
          isApproved: product.isApproved,
          approvedBy: undefined,
          approvedAt: product.approvedAt,
          createdBy: product.createdBy ? {
            id: product.createdBy.id,
            firstName: product.createdBy.firstName,
            lastName: product.createdBy.lastName,
            email: product.createdBy.officialEmail,
          } : undefined,
          updatedBy: product.updatedBy ? {
            id: product.updatedBy.id,
            firstName: product.updatedBy.firstName,
            lastName: product.updatedBy.lastName,
            email: product.updatedBy.officialEmail,
          } : undefined,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      };

      return response;
    } catch (error) {
      this.logger.error('Error deleting product', error);
      throw error;
    }
  }

  // Approval workflow methods
  async approveProduct(id: number, adminUserId: number): Promise<ProductResponseWrapper> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      if (product.isApproved) {
        throw new Error('Product is already approved');
      }

      const admin = await this.userRepo.findOne({ where: { id: adminUserId } });
      if (!admin) throw new NotFoundException('Admin user not found');

      product.isApproved = true;
      product.approvedBy = admin;
      product.approvedAt = new Date();

      const updatedProduct = await this.productRepo.save(product);
      return PRODUCT_RESPONSES.PRODUCT_APPROVED(updatedProduct);
    } catch (error) {
      this.logger.error('Error approving product', error);
      throw error;
    }
  }

  async rejectProduct(id: number, adminUserId: number, rejectionReason?: string): Promise<ProductResponseWrapper> {
    try {
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) throw new NotFoundException(PRODUCT_RESPONSES.PRODUCT_NOT_FOUND());

      if (product.isApproved) {
        throw new Error('Cannot reject an already approved product');
      }

      const admin = await this.userRepo.findOne({ where: { id: adminUserId } });
      if (!admin) throw new NotFoundException('Admin user not found');

      // For rejection, we might want to delete the product or mark it as rejected
      // For now, let's delete it
      await this.productRepo.delete(id);
      
      // Create a proper response object for rejected product
      const response = {
        success: true,
        message: `Product with ID ${product.id} rejected successfully`,
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          imagesPath: product.imagesPath,
          category: product.category ? {
            id: product.category.id,
            categoryName: product.category.categoryName,
            description: product.category.description,
          } : undefined,
          brand: product.brand ? {
            id: product.brand.id,
            brandName: product.brand.brandName,
            description: product.brand.brandDescription,
          } : undefined,
          vendor: product.vendor ? {
            id: product.vendor.id,
            vendorName: product.vendor.vendorName,
            businessName: product.vendor.businessName,
            isVerified: product.vendor.isVerified,
          } : undefined,
          features: [],
          price: product.price,
          totalNoOfStock: product.totalNoOfStock,
          noOfStock: product.noOfStock,
          inStock: product.inStock,
          isApproved: product.isApproved,
          approvedBy: undefined,
          approvedAt: product.approvedAt,
          createdBy: product.createdBy ? {
            id: product.createdBy.id,
            firstName: product.createdBy.firstName,
            lastName: product.createdBy.lastName,
            email: product.createdBy.officialEmail,
          } : undefined,
          updatedBy: product.updatedBy ? {
            id: product.updatedBy.id,
            firstName: product.updatedBy.firstName,
            lastName: product.updatedBy.lastName,
            email: product.updatedBy.officialEmail,
          } : undefined,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      };

      return response;
    } catch (error) {
      this.logger.error('Error rejecting product', error);
      throw error;
    }
  }

  async getPendingApprovalProducts(): Promise<ProductsResponseWrapper> {
    try {
      const products = await this.productRepo.find({
        where: { isApproved: false },
        relations: ['category', 'brand', 'vendor', 'createdBy', 'updatedBy', 'approvedBy'],
      });
      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error getting pending approval products', error);
      throw error;
    }
  }

  async getApprovedProducts(): Promise<ProductsResponseWrapper> {
    try {
      const products = await this.productRepo.find({
        where: { isApproved: true },
        relations: ['category', 'brand', 'vendor', 'createdBy', 'updatedBy', 'approvedBy'],
      });
      if (!products.length) return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();

      return PRODUCT_RESPONSES.PRODUCTS_FETCHED(products);
    } catch (error) {
      this.logger.error('Error getting approved products', error);
      throw error;
    }
  }

  async getVendorProducts(vendorId: number, includePending: boolean = false): Promise<ProductsResponseWrapper> {
    try {
      const products = await this.productRepo.find({
        where: {
          vendor: { id: vendorId },
          isApproved: !includePending, // Only approved products if includePending is false
        },
        relations: ['category', 'brand', 'vendor', 'createdBy', 'updatedBy', 'approvedBy'],
      });
      
      if (!products || products.length === 0) {
        return PRODUCT_RESPONSES.PRODUCTS_NOT_FOUND();
      }

      const productDtos = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imagesPath: product.imagesPath,
        category: product.category ? {
          id: product.category.id,
          categoryName: product.category.categoryName,
          description: product.category.description,
        } : undefined,
        brand: product.brand ? {
          id: product.brand.id,
          brandName: product.brand.brandName,
          description: product.brand.brandDescription,
        } : undefined,
        vendor: product.vendor ? {
          id: product.vendor.id,
          vendorName: product.vendor.vendorName,
          businessName: product.vendor.businessName,
          isVerified: product.vendor.isVerified,
        } : undefined,
        features: [], // Features are not directly fetched here, they are in productFeatures
        price: product.price,
        totalNoOfStock: product.totalNoOfStock,
        noOfStock: product.noOfStock,
        inStock: product.inStock,
        isApproved: product.isApproved,
        approvedBy: product.approvedBy ? {
          id: product.approvedBy.id,
          firstName: product.approvedBy.firstName,
          lastName: product.approvedBy.lastName,
          email: product.approvedBy.officialEmail,
        } : undefined,
        approvedAt: product.approvedAt,
        createdBy: product.createdBy ? {
          id: product.createdBy.id,
          firstName: product.createdBy.firstName,
          lastName: product.createdBy.lastName,
          email: product.createdBy.officialEmail,
        } : undefined,
        updatedBy: product.updatedBy ? {
          id: product.updatedBy.id,
          firstName: product.updatedBy.firstName,
          lastName: product.updatedBy.lastName,
          email: product.updatedBy.officialEmail,
        } : undefined,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      return {
        success: true,
        message: 'Vendor products retrieved successfully',
        data: productDtos,
      };
    } catch (error) {
      this.logger.error('Error getting vendor products', error);
      throw error;
    }
  }

  async getVendorApprovedProducts(vendorId: number): Promise<ProductsResponseWrapper> {
    return this.getVendorProducts(vendorId, false);
  }

  async getVendorPendingProducts(vendorId: number): Promise<ProductsResponseWrapper> {
    return this.getVendorProducts(vendorId, true);
  }

  private async getFeatureDetails(featureIds: number[]): Promise<Array<{ id: number; name: string }>> {
    if (!featureIds || featureIds.length === 0) {
      return [];
    }

    try {
      // Get feature details from the feature repository
      const features = await Promise.all(
        featureIds.map(id => this.featureRepo.findOne({ where: { id } }))
      );
      
      return features
        .filter(feature => feature !== null)
        .map(feature => ({
          id: feature.id,
          name: feature.name,
        }));
    } catch (error) {
      this.logger.error('Error getting feature details', error);
      // Return feature IDs if we can't get the details
      return featureIds.map(id => ({ id, name: `Feature ${id}` }));
    }
  }

  

  async getProductVariants(productId: number): Promise<any> {
    try {
      const variants = await this.productVariantRepo.find({
        where: { productId, isActive: true },
        relations: ['attributes', 'attributes.attribute', 'attributes.attributeValue'],
        order: { sortOrder: 'ASC', sku: 'ASC' },
      });

      return {
        success: true,
        message: 'Product variants retrieved successfully',
        data: variants.map(variant => ({
          id: variant.id,
          sku: variant.sku,
          name: variant.name,
          price: variant.price,
          stock: variant.stock,
          barcode: variant.barcode,
          weight: variant.weight,
          dimensions: variant.dimensions,
          variantImages: variant.variantImages,
          isActive: variant.isActive,
          sortOrder: variant.sortOrder,
          attributes: variant.attributes?.map(attr => ({
            id: attr.id,
            attribute: {
              id: attr.attribute.id,
              name: attr.attribute.name,
              type: attr.attribute.type,
            },
            attributeValue: {
              id: attr.attributeValue.id,
              value: attr.attributeValue.value,
              displayName: attr.attributeValue.displayName,
            },
          })) || [],
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
        })),
      };
    } catch (error) {
      this.logger.error('Error getting product variants', error);
      throw error;
    }
  }

  async getVariantAvailability(
    productId: number,
    selected?: Array<{ attributeId: number; attributeValueId: number }>,
  ): Promise<any> {
    try {
      const variants = await this.productVariantRepo.find({
        where: { productId, isActive: true },
        relations: ['attributes', 'attributes.attribute', 'attributes.attributeValue'],
        order: { sortOrder: 'ASC', sku: 'ASC' },
      });

      // Build index: attributeId -> valueId -> Set(variantIndex)
      const index: Map<number, Map<number, Set<number>>> = new Map();
      variants.forEach((v, i) => {
        v.attributes?.forEach(attr => {
          const attributeId = attr.attribute.id;
          const valueId = attr.attributeValue.id;
          if (!index.has(attributeId)) index.set(attributeId, new Map());
          const valMap = index.get(attributeId)!;
          if (!valMap.has(valueId)) valMap.set(valueId, new Set());
          valMap.get(valueId)!.add(i);
        });
      });

      // Start with all variants as candidates
      let candidate = new Set(variants.map((_, i) => i));
      if (selected && selected.length > 0) {
        for (const s of selected) {
          const setForChoice = index.get(s.attributeId)?.get(s.attributeValueId) ?? new Set<number>();
          candidate = new Set([...candidate].filter(i => setForChoice.has(i)));
        }
      }

      // Compute available valueIds per attribute from candidate variants
      const availableByAttribute: Record<number, number[]> = {};
      for (const [attrId, valMap] of index.entries()) {
        const allowed = new Set<number>();
        for (const [valId, setOfVariants] of valMap.entries()) {
          for (const i of setOfVariants) {
            if (candidate.has(i)) { allowed.add(valId); break; }
          }
        }
        availableByAttribute[attrId] = Array.from(allowed);
      }

      return {
        success: true,
        message: 'Variant availability computed',
        data: {
          availableByAttribute,
          candidateVariantIds: Array.from(candidate).map(i => variants[i].id),
        },
      };
    } catch (error) {
      this.logger.error('Error computing variant availability', error);
      throw error;
    }
  }

  async getProductVariantsForFrontend(productId: number): Promise<FrontendVariantsResponseWrapper> {
    try {
      const variants = await this.productVariantRepo.find({
        where: { productId, isActive: true },
        relations: ['attributes', 'attributes.attribute', 'attributes.attributeValue'],
        order: { sortOrder: 'ASC', sku: 'ASC' },
      });

      // Group attributes by type for easy frontend iteration
      const attributeGroups: { [key: string]: any[] } = {};
      const processedValues: { [key: string]: Set<number> } = {};

      // First pass: collect all unique attribute values
      variants.forEach(variant => {
        variant.attributes?.forEach(attr => {
          const attrName = attr.attribute.name.toLowerCase(); // Use lowercase for consistency
          const valueId = attr.attributeValue.id;
          
          if (!attributeGroups[attrName]) {
            attributeGroups[attrName] = [];
            processedValues[attrName] = new Set();
          }
          
          // Add unique values only once
          if (!processedValues[attrName].has(valueId)) {
            processedValues[attrName].add(valueId);
            attributeGroups[attrName].push({
              id: valueId,
              name: attr.attributeValue.value,
              displayName: attr.attributeValue.displayName,
            });
          }
        });
      });

      // Second pass: create simplified variants with attribute references
      const simplifiedVariants = variants.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        barcode: variant.barcode,
        weight: variant.weight,
        dimensions: variant.dimensions,
        variantImages: variant.variantImages,
        isActive: variant.isActive,
        sortOrder: variant.sortOrder,
        // Simple attribute mapping for frontend
        attributes: variant.attributes?.reduce((acc, attr) => {
          const attrName = attr.attribute.name.toLowerCase();
          acc[attrName] = {
            id: attr.attributeValue.id,
            name: attr.attributeValue.value,
            displayName: attr.attributeValue.displayName,
          };
          return acc;
        }, {} as any) || {},
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt,
      }));

      return {
        success: true,
        message: 'Product variants retrieved successfully for frontend',
        data: {
          // Grouped attributes for easy iteration
          attributeGroups,
          // Simplified variants with attribute references
          variants: simplifiedVariants,
        },
      };
    } catch (error) {
      this.logger.error('Error getting product variants for frontend', error);
      throw error;
    }
  }
}
