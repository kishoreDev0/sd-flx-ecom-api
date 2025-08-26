import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';

@Injectable()
export class VendorRepository extends Repository<Vendor> {
  constructor(private dataSource: DataSource) {
    super(Vendor, dataSource.createEntityManager());
  }

  async findVendorById(id: number): Promise<Vendor> {
    return this.findOne({
      where: { id },
      relations: ['user', 'createdBy', 'updatedBy', 'brands', 'products'],
    });
  }

  async findVendorByUserId(userId: number): Promise<Vendor> {
    return this.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'createdBy', 'updatedBy', 'brands', 'products'],
    });
  }

  async findAllVendors(): Promise<Vendor[]> {
    return this.find({
      relations: ['user', 'createdBy', 'updatedBy', 'brands', 'products'],
      order: { vendorName: 'ASC' },
    });
  }

  async findActiveVendors(): Promise<Vendor[]> {
    return this.find({
      where: { isActive: true },
      relations: ['user', 'createdBy', 'updatedBy'],
      order: { vendorName: 'ASC' },
    });
  }

  async findVerifiedVendors(): Promise<Vendor[]> {
    return this.find({
      where: { isVerified: true, isActive: true },
      relations: ['user', 'createdBy', 'updatedBy'],
      order: { vendorName: 'ASC' },
    });
  }

  async findPendingVerificationVendors(): Promise<Vendor[]> {
    return this.find({
      where: { isVerified: false, isActive: true },
      relations: ['user', 'createdBy', 'updatedBy'],
      order: { createdAt: 'ASC' },
    });
  }

  async createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
    const vendor = this.create(vendorData);
    return this.save(vendor);
  }

  async updateVendor(id: number, vendorData: Partial<Vendor>): Promise<Vendor> {
    await this.update(id, vendorData);
    return this.findVendorById(id);
  }

  async deleteVendor(id: number): Promise<void> {
    await this.delete(id);
  }

  async softDeleteVendor(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  async restoreVendor(id: number): Promise<void> {
    await this.update(id, { isActive: true });
  }

  async verifyVendor(id: number, verificationData: any): Promise<Vendor> {
    const updateData = {
      ...verificationData,
      verificationDate: new Date(),
    };
    await this.update(id, updateData);
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
