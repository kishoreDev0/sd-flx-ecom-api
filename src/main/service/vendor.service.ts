import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { VendorRepository } from '../repository/vendor.repository';
import { UserRepository } from '../repository/user.repository';
import { CreateVendorDto } from '../dto/requests/vendor/create-vendor.dto';
import { UpdateVendorDto } from '../dto/requests/vendor/update-vendor.dto';
import { VerifyVendorDto } from '../dto/requests/vendor/verify-vendor.dto';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class VendorService {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createVendorDto: CreateVendorDto, adminUser: User): Promise<Vendor> {
    // Check if user already has a vendor profile
    if (createVendorDto.userId) {
      const existingVendor = await this.vendorRepository.findVendorByUserId(createVendorDto.userId);
      if (existingVendor) {
        throw new ConflictException('User already has a vendor profile');
      }
    }

    const vendorData: any = {
      ...createVendorDto,
      createdBy: adminUser,
      updatedBy: adminUser,
    };

    if (createVendorDto.userId) {
      const user = await this.userRepository.findUserById(createVendorDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      vendorData.user = user;
    }

    return this.vendorRepository.createVendor(vendorData);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.findAllVendors();
  }

  async findActive(): Promise<Vendor[]> {
    return this.vendorRepository.findActiveVendors();
  }

  async findVerified(): Promise<Vendor[]> {
    return this.vendorRepository.findVerifiedVendors();
  }

  async findPendingVerification(): Promise<Vendor[]> {
    return this.vendorRepository.findPendingVerificationVendors();
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findByUserId(userId: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorByUserId(userId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto, adminUser: User): Promise<Vendor> {
    const existingVendor = await this.vendorRepository.findVendorById(id);
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updateData = {
      ...updateVendorDto,
      updatedBy: adminUser,
    };

    return this.vendorRepository.updateVendor(id, updateData);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Check if vendor has associated products or brands
    if ((vendor.products && vendor.products.length > 0) || 
        (vendor.brands && vendor.brands.length > 0)) {
      throw new ConflictException('Cannot delete vendor with associated products or brands');
    }

    await this.vendorRepository.deleteVendor(id);
  }

  async softDelete(id: number): Promise<void> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    await this.vendorRepository.softDeleteVendor(id);
  }

  async restore(id: number): Promise<void> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    await this.vendorRepository.restoreVendor(id);
  }

  async verify(id: number, verifyVendorDto: VerifyVendorDto, adminUser: User): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const verificationData = {
      ...verifyVendorDto,
      updatedBy: adminUser,
    };

    return this.vendorRepository.verifyVendor(id, verificationData);
  }

  async getVendorStats(): Promise<{ total: number; active: number; verified: number; pending: number }> {
    return this.vendorRepository.getVendorStats();
  }

  async getMyVendorProfile(userId: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorByUserId(userId);
    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }
    return vendor;
  }

  async updateMyProfile(userId: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorByUserId(userId);
    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    // Vendors can only update certain fields
    const allowedFields = [
      'vendorName', 'businessName', 'businessAddress', 
      'phoneNumber', 'taxId', 'businessLicense'
    ];

    const filteredData = Object.keys(updateVendorDto)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateVendorDto[key];
        return obj;
      }, {});

    return this.vendorRepository.updateVendor(vendor.id, filteredData);
  }

  async updatePayoutSettings(id: number, data: { payoutMethod?: string; payoutAccount?: string; updatedBy: User }): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) throw new NotFoundException('Vendor not found');
    return this.vendorRepository.updateVendor(id, {
      payoutMethod: data.payoutMethod,
      payoutAccount: data.payoutAccount,
      updatedBy: data.updatedBy,
    } as any);
  }

  async updateKycStatus(id: number, data: { kycStatus: string; kycDocuments?: any[]; updatedBy: User }): Promise<Vendor> {
    const vendor = await this.vendorRepository.findVendorById(id);
    if (!vendor) throw new NotFoundException('Vendor not found');
    return this.vendorRepository.updateVendor(id, {
      kycStatus: data.kycStatus,
      kycDocuments: data.kycDocuments,
      updatedBy: data.updatedBy,
    } as any);
  }
}
