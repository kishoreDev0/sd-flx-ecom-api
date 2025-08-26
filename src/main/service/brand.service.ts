import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BrandRepository } from '../repository/brand.repository';
import { VendorRepository } from '../repository/vendor.repository';
import { CreateBrandDto } from '../dto/requests/brand/create-brand.dto';
import { UpdateBrandDto } from '../dto/requests/brand/update-brand.dto';
import { Brand } from '../entities/brand.entity';
import { User } from '../entities/user.entity';
import { Vendor } from '../entities/vendor.entity';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly vendorRepository: VendorRepository,
  ) {}

  async create(createBrandDto: CreateBrandDto, user: User): Promise<Brand> {
    // Check if brand name already exists
    const existingBrand = await this.brandRepository.findBrandByName(
      createBrandDto.brandName,
    );
    if (existingBrand) {
      throw new ConflictException('Brand name already exists');
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

    return this.brandRepository.createBrand(brandData);
  }

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.findAllBrands();
  }

  async findActive(): Promise<Brand[]> {
    return this.brandRepository.findActiveBrands();
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findBrandById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async findByName(brandName: string): Promise<Brand> {
    const brand = await this.brandRepository.findBrandByName(brandName);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async findWithProducts(): Promise<Brand[]> {
    return this.brandRepository.findBrandsWithProducts();
  }

  async findByUserId(userId: number): Promise<Brand[]> {
    return this.brandRepository.findBrandsByUserId(userId);
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

    const updateData = {
      ...updateBrandDto,
      updatedBy: user,
    };

    return this.brandRepository.updateBrand(id, updateData);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.brandRepository.findBrandById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    // Check if brand has associated products
    if (brand.products && brand.products.length > 0) {
      throw new ConflictException('Cannot delete brand with associated products');
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
