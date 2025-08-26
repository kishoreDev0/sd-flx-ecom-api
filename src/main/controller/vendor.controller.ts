import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VendorService } from '../service/vendor.service';
import { CreateVendorDto } from '../dto/requests/vendor/create-vendor.dto';
import { UpdateVendorDto } from '../dto/requests/vendor/update-vendor.dto';
import { VerifyVendorDto } from '../dto/requests/vendor/verify-vendor.dto';
import { 
  VendorResponseWrapper, 
  VendorsResponseWrapper 
} from '../dto/responses/vendor-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { Public } from '../commons/decorators/public.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';
import { Roles } from '../commons/enumerations/role.enum';

@ApiTags('Vendors')
@Controller('v1/vendors')
@UseGuards(AuthGuard)
@ApiHeadersForAuth()
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: VendorResponseWrapper })
  async create(@Body() createVendorDto: CreateVendorDto, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isAdmin = await this.commonUtilService.isUserAdmin(userId);
      
      if (!isAdmin) {
        throw new Error('Only admins can create vendors');
      }

      const adminUser = await this.commonUtilService.getUserById(userId);
      const vendor = await this.vendorService.create(createVendorDto, adminUser);
      
      return {
        success: true,
        message: 'Vendor created successfully',
        data: vendor,
      };
    } catch (error) {
      this.loggerService.error('Error creating vendor', error);
      throw error;
    }
  }

  @Get()
  @ApiResponse({ status: 200, type: VendorsResponseWrapper })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'verified', required: false, description: 'Filter by verification status' })
  @ApiQuery({ name: 'pending', required: false, description: 'Filter pending verification' })
  async findAll(
    @Query('active') active?: string,
    @Query('verified') verified?: string,
    @Query('pending') pending?: string,
  ) {
    try {
      let vendors;
      
      if (active === 'true') {
        vendors = await this.vendorService.findActive();
      } else if (verified === 'true') {
        vendors = await this.vendorService.findVerified();
      } else if (pending === 'true') {
        vendors = await this.vendorService.findPendingVerification();
      } else {
        vendors = await this.vendorService.findAll();
      }

      return {
        success: true,
        message: 'Vendors retrieved successfully',
        data: vendors,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving vendors', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiResponse({ status: 200, description: 'Vendor statistics' })
  async getStats() {
    try {
      const stats = await this.vendorService.getVendorStats();
      
      return {
        success: true,
        message: 'Vendor statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving vendor stats', error);
      throw error;
    }
  }

  @Get('my-profile')
  @ApiResponse({ status: 200, type: VendorResponseWrapper })
  async getMyProfile(@Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const vendor = await this.vendorService.getMyVendorProfile(userId);
      
      return {
        success: true,
        message: 'Vendor profile retrieved successfully',
        data: vendor,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving vendor profile', error);
      throw error;
    }
  }

  @Get('pending-verification')
  @ApiResponse({ status: 200, type: VendorsResponseWrapper })
  async getPendingVerification() {
    try {
      const vendors = await this.vendorService.findPendingVerification();
      
      return {
        success: true,
        message: 'Pending verification vendors retrieved successfully',
        data: vendors,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving pending verification vendors', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: VendorResponseWrapper })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const vendor = await this.vendorService.findOne(id);
      
      return {
        success: true,
        message: 'Vendor retrieved successfully',
        data: vendor,
      };
    } catch (error) {
      this.loggerService.error('Error retrieving vendor', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: VendorResponseWrapper })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isAdmin = await this.commonUtilService.isUserAdmin(userId);
      
      if (!isAdmin) {
        throw new Error('Only admins can update vendors');
      }

      const adminUser = await this.commonUtilService.getUserById(userId);
      const vendor = await this.vendorService.update(id, updateVendorDto, adminUser);
      
      return {
        success: true,
        message: 'Vendor updated successfully',
        data: vendor,
      };
    } catch (error) {
      this.loggerService.error('Error updating vendor', error);
      throw error;
    }
  }

  @Patch('my-profile')
  @ApiResponse({ status: 200, type: VendorResponseWrapper })
  async updateMyProfile(
    @Body() updateVendorDto: UpdateVendorDto,
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const vendor = await this.vendorService.updateMyProfile(userId, updateVendorDto);
      
      return {
        success: true,
        message: 'Vendor profile updated successfully',
        data: vendor,
      };
    } catch (error) {
      this.loggerService.error('Error updating vendor profile', error);
      throw error;
    }
  }

  @Patch(':id/verify')
  @ApiResponse({ status: 200, type: VendorResponseWrapper })
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyVendorDto: VerifyVendorDto,
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isAdmin = await this.commonUtilService.isUserAdmin(userId);
      
      if (!isAdmin) {
        throw new Error('Only admins can verify vendors');
      }

      const adminUser = await this.commonUtilService.getUserById(userId);
      const vendor = await this.vendorService.verify(id, verifyVendorDto, adminUser);
      
      return {
        success: true,
        message: 'Vendor verification updated successfully',
        data: vendor,
      };
    } catch (error) {
      this.loggerService.error('Error verifying vendor', error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isAdmin = await this.commonUtilService.isUserAdmin(userId);
      
      if (!isAdmin) {
        throw new Error('Only admins can delete vendors');
      }

      await this.vendorService.remove(id);
      
      return {
        success: true,
        message: 'Vendor deleted successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error deleting vendor', error);
      throw error;
    }
  }

  @Patch(':id/soft-delete')
  @ApiResponse({ status: 200, description: 'Vendor soft deleted successfully' })
  async softDelete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isAdmin = await this.commonUtilService.isUserAdmin(userId);
      
      if (!isAdmin) {
        throw new Error('Only admins can soft delete vendors');
      }

      await this.vendorService.softDelete(id);
      
      return {
        success: true,
        message: 'Vendor soft deleted successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error soft deleting vendor', error);
      throw error;
    }
  }

  @Patch(':id/restore')
  @ApiResponse({ status: 200, description: 'Vendor restored successfully' })
  async restore(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const isAdmin = await this.commonUtilService.isUserAdmin(userId);
      
      if (!isAdmin) {
        throw new Error('Only admins can restore vendors');
      }

      await this.vendorService.restore(id);
      
      return {
        success: true,
        message: 'Vendor restored successfully',
        data: null,
      };
    } catch (error) {
      this.loggerService.error('Error restoring vendor', error);
      throw error;
    }
  }
}
