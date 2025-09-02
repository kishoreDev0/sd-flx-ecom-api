import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandRepository } from '../repository/brand.repository';
import { VendorRepository } from '../repository/vendor.repository';
import { CreateBrandDto } from '../dto/requests/brand/create-brand.dto';
import { UpdateBrandDto } from '../dto/requests/brand/update-brand.dto';
import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';
import { BrandCategory } from '../entities/brand-category.entity';
import { User } from '../entities/user.entity';
import { Vendor } from '../entities/vendor.entity';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly vendorRepository: VendorRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(BrandCategory)
    private readonly brandCategoryRepository: Repository<BrandCategory>,
  ) {}

  private async enrichBrandWithDetails(brand: Brand): Promise<Brand> {
    // Get vendor details
    if (brand.vendor) {
      brand.vendor = await this.vendorRepository.findVendorById(brand.vendor.id);
    }

    // Get primary category details
    const primaryCategoryMapping = await this.brandCategoryRepository.findOne({
      where: { brandId: brand.id, isPrimary: true },
      relations: ['category'],
    });

    if (primaryCategoryMapping?.category) {
      (brand as any).primaryCategory = primaryCategoryMapping.category;
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto, user: User): Promise<Brand> {
    // Check if brand name already exists
    const existingBrand = await this.brandRepository.findBrandByName(
      createBrandDto.brandName,
    );
    if (existingBrand) {
      throw new ConflictException('Brand name already exists');
    }

    // Check if category exists
    const category = await this.categoryRepository.findOneBy({ id: createBrandDto.categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const brandData: any = {
      ...createBrandDto,
      createdBy: user,
    };

    // Associate vendor if provided
    if (createBrandDto.vendorId) {
      const vendor = await this.vendorRepository.findVendorById(createBrandDto.vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
      brandData.vendor = vendor;
    }

    // Create the brand
    const brand = await this.brandRepository.createBrand(brandData);

    // Automatically create brand-category mapping
    const mappingData = {
      brandId: brand.id,
      categoryId: createBrandDto.categoryId,
      isPrimary: true,
      sortOrder: 0,
      isActive: true,
      createdBy: user,
      updatedBy: user,
    };

    const brandCategory = this.brandCategoryRepository.create(mappingData);
    await this.brandCategoryRepository.save(brandCategory);

    // Enrich brand with additional details
    return this.enrichBrandWithDetails(brand);
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.brandRepository.findAllBrands();
    // Enrich each brand with details
    const enrichedBrands = await Promise.all(
      brands.map(brand => this.enrichBrandWithDetails(brand))
    );
    return enrichedBrands;
  }

  async findActive(): Promise<Brand[]> {
    const brands = await this.brandRepository.findActiveBrands();
    // Enrich each brand with details
    const enrichedBrands = await Promise.all(
      brands.map(brand => this.enrichBrandWithDetails(brand))
    );
    return enrichedBrands;
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findBrandById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return this.enrichBrandWithDetails(brand);
  }

  async findByName(brandName: string): Promise<Brand> {
    const brand = await this.brandRepository.findBrandByName(brandName);
    if (!brand) throw new NotFoundException('Brand not found');
    return this.enrichBrandWithDetails(brand);
  }

  async findWithProducts(): Promise<Brand[]> {
    const brands = await this.brandRepository.findBrandsWithProducts();
    // Enrich each brand with details
    const enrichedBrands = await Promise.all(
      brands.map(brand => this.enrichBrandWithDetails(brand))
    );
    return enrichedBrands;
  }

  async findByUserId(userId: number): Promise<Brand[]> {
    const brands = await this.brandRepository.findBrandsByUserId(userId);
    // Enrich each brand with details
    const enrichedBrands = await Promise.all(
      brands.map(brand => this.enrichBrandWithDetails(brand))
    );
    return enrichedBrands;
  }

  async findByVendorId(vendorId: number): Promise<Brand[]> {
    const brands = await this.brandRepository.findBrandsByVendorId(vendorId);
    // Enrich each brand with details
    const enrichedBrands = await Promise.all(
      brands.map(brand => this.enrichBrandWithDetails(brand))
    );
    return enrichedBrands;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, user: User): Promise<Brand> {
    // Check if brand exists
    const existingBrand = await this.brandRepository.findBrandById(id);
    if (!existingBrand) {
      throw new NotFoundException('Brand not found');
    }

    // If brand name is being updated, check for conflicts
    if (updateBrandDto.brandName && updateBrandDto.brandName !== existingBrand.brandName) {
      const brandWithSameName = await this.brandRepository.findBrandByName(
        updateBrandDto.brandName,
      );
      if (brandWithSameName) {
        throw new ConflictException('Brand name already exists');
      }
    }

    // Remove fields that shouldn't be updated
    const { createdBy, categoryId, ...updateData } = updateBrandDto;
    
    const finalUpdateData = {
      ...updateData,
      updatedBy: user,
    };

    const updatedBrand = await this.brandRepository.updateBrand(id, finalUpdateData);
    return this.enrichBrandWithDetails(updatedBrand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.brandRepository.findBrandById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    await this.brandRepository.deleteBrand(id);
  }

  async softDelete(id: number): Promise<void> {
    const brand = await this.brandRepository.findBrandById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.softDeleteBrand(id);
  }

  async restore(id: number): Promise<void> {
    const brand = await this.brandRepository.findBrandById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.restoreBrand(id);
  }

  async getBrandStats(): Promise<{ total: number; active: number; inactive: number }> {
    const allBrands = await this.brandRepository.findAllBrands();
    const activeBrands = allBrands.filter(brand => brand.isActive);
    
    return {
      total: allBrands.length,
      active: activeBrands.length,
      inactive: allBrands.length - activeBrands.length,
    };
  }
}
