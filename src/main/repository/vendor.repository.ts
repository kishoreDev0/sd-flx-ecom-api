import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';

@Injectable()
export class VendorRepository {
  constructor(
    @InjectRepository(Vendor)
    private readonly repo: Repository<Vendor>,
  ) {}

  async findVendorById(id: number): Promise<Vendor> {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'createdBy', 'updatedBy', 'brands', 'products'],
    });
  }

  async findVendorByUserId(userId: number): Promise<Vendor> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'createdBy', 'updatedBy', 'brands', 'products'],
    });
  }

  async findAllVendors(): Promise<Vendor[]> {
    return this.repo.find({
      relations: ['user', 'createdBy', 'updatedBy', 'brands', 'products'],
      order: { vendorName: 'ASC' },
    });
  }

  async findActiveVendors(): Promise<Vendor[]> {
    return this.repo.find({
      where: { isActive: true },
      relations: ['user', 'createdBy', 'updatedBy'],
      order: { vendorName: 'ASC' },
    });
  }

  async findVerifiedVendors(): Promise<Vendor[]> {
    return this.repo.find({
      where: { isVerified: true, isActive: true },
      relations: ['user', 'createdBy', 'updatedBy'],
      order: { vendorName: 'ASC' },
    });
  }

  async findPendingVerificationVendors(): Promise<Vendor[]> {
    return this.repo.find({
      where: { isVerified: false, isActive: true },
      relations: ['user', 'createdBy', 'updatedBy'],
      order: { createdAt: 'ASC' },
    });
  }

  async createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
    const vendor = this.repo.create(vendorData);
    return this.repo.save(vendor);
  }

  async updateVendor(id: number, vendorData: Partial<Vendor>): Promise<Vendor> {
    await this.repo.update(id, vendorData);
    return this.findVendorById(id);
  }

  async deleteVendor(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async softDeleteVendor(id: number): Promise<void> {
    await this.repo.update(id, { isActive: false });
  }

  async restoreVendor(id: number): Promise<void> {
    await this.repo.update(id, { isActive: true });
  }

  async verifyVendor(id: number, verificationData: any): Promise<Vendor> {
    const updateData = {
      ...verificationData,
      verificationDate: new Date(),
    };
    await this.repo.update(id, updateData);
    return this.findVendorById(id);
  }

  async getVendorStats(): Promise<{ total: number; active: number; verified: number; pending: number }> {
    const allVendors = await this.findAllVendors();
    const activeVendors = allVendors.filter(vendor => vendor.isActive);
    const verifiedVendors = activeVendors.filter(vendor => vendor.isVerified);
    
    return {
      total: allVendors.length,
      active: activeVendors.length,
      verified: verifiedVendors.length,
      pending: activeVendors.length - verifiedVendors.length,
    };
  }
}
