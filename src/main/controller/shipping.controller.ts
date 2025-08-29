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
  Query,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ShippingService } from '../service/shipping.service';
import { CreateShippingAddressDto, UpdateShippingAddressDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CreateShippingMethodDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CreateShippingZoneDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CreateShipmentDto, UpdateShipmentStatusDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CalculateShippingDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { 
  ShippingAddressResponseDto, 
  ShippingMethodResponseDto, 
  ShippingZoneResponseDto, 
  ShipmentResponseDto, 
  ShippingCalculationResponseDto,
  ShippingStatsDto 
} from '../dto/responses/shipping-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { Roles } from '../commons/enumerations/role.enum';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';
import { ShippingStatus, CarrierType } from '../entities/shipping.entity';

@ApiTags('shipping')
@Controller('v1/shipping')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeadersForAuth()
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  // Shipping Address Endpoints
  @Post('addresses')
  @RequireRoles(Roles.CUSTOMER)
  @ApiResponse({ status: 201, description: 'Shipping address created', type: ShippingAddressResponseDto })
  async createShippingAddress(@Body() createAddressDto: CreateShippingAddressDto) {
    try {
      const address = await this.shippingService.createShippingAddress(createAddressDto);
      return {
        success: true,
        message: 'Shipping address created successfully',
        data: address,
      };
    } catch (error) {
      this.loggerService.error('Error creating shipping address', error);
      throw error;
    }
  }

  @Get('addresses')
  @RequireRoles(Roles.CUSTOMER)
  @ApiResponse({ status: 200, description: 'Shipping addresses fetched', type: [ShippingAddressResponseDto] })
  async getMyShippingAddresses(@Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const addresses = await this.shippingService.findAllShippingAddresses(userId);
      return {
        success: true,
        message: 'Shipping addresses fetched successfully',
        data: addresses,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipping addresses', error);
      throw error;
    }
  }

  @Get('addresses/:id')
  @RequireRoles(Roles.CUSTOMER)
  @ApiResponse({ status: 200, description: 'Shipping address found', type: ShippingAddressResponseDto })
  async getShippingAddress(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const address = await this.shippingService.findOneShippingAddress(id, userId);
      return {
        success: true,
        message: 'Shipping address fetched successfully',
        data: address,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipping address', error);
      throw error;
    }
  }

  @Patch('addresses/:id')
  @RequireRoles(Roles.CUSTOMER)
  @ApiResponse({ status: 200, description: 'Shipping address updated', type: ShippingAddressResponseDto })
  async updateShippingAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateShippingAddressDto,
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const address = await this.shippingService.updateShippingAddress(id, updateAddressDto, userId);
      return {
        success: true,
        message: 'Shipping address updated successfully',
        data: address,
      };
    } catch (error) {
      this.loggerService.error('Error updating shipping address', error);
      throw error;
    }
  }

  @Delete('addresses/:id')
  @RequireRoles(Roles.CUSTOMER)
  @ApiResponse({ status: 200, description: 'Shipping address deleted' })
  async removeShippingAddress(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      await this.shippingService.removeShippingAddress(id, userId);
      return {
        success: true,
        message: 'Shipping address deleted successfully',
      };
    } catch (error) {
      this.loggerService.error('Error deleting shipping address', error);
      throw error;
    }
  }

  // Shipping Method Endpoints
  @Post('methods')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 201, description: 'Shipping method created', type: ShippingMethodResponseDto })
  async createShippingMethod(@Body() createMethodDto: CreateShippingMethodDto) {
    try {
      const method = await this.shippingService.createShippingMethod(createMethodDto);
      return {
        success: true,
        message: 'Shipping method created successfully',
        data: method,
      };
    } catch (error) {
      this.loggerService.error('Error creating shipping method', error);
      throw error;
    }
  }

  @Get('methods')
  @ApiResponse({ status: 200, description: 'Shipping methods fetched', type: [ShippingMethodResponseDto] })
  async getShippingMethods() {
    try {
      const methods = await this.shippingService.findAllShippingMethods();
      return {
        success: true,
        message: 'Shipping methods fetched successfully',
        data: methods,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipping methods', error);
      throw error;
    }
  }

  // Shipping Zone Endpoints
  @Post('zones')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 201, description: 'Shipping zone created', type: ShippingZoneResponseDto })
  async createShippingZone(@Body() createZoneDto: CreateShippingZoneDto) {
    try {
      const zone = await this.shippingService.createShippingZone(createZoneDto);
      return {
        success: true,
        message: 'Shipping zone created successfully',
        data: zone,
      };
    } catch (error) {
      this.loggerService.error('Error creating shipping zone', error);
      throw error;
    }
  }

  @Get('zones')
  @ApiResponse({ status: 200, description: 'Shipping zones fetched', type: [ShippingZoneResponseDto] })
  async getShippingZones() {
    try {
      const zones = await this.shippingService.findAllShippingZones();
      return {
        success: true,
        message: 'Shipping zones fetched successfully',
        data: zones,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipping zones', error);
      throw error;
    }
  }

  // Shipment Endpoints
  @Post('shipments')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 201, description: 'Shipment created', type: ShipmentResponseDto })
  async createShipment(@Body() createShipmentDto: CreateShipmentDto) {
    try {
      const shipment = await this.shippingService.createShipment(createShipmentDto);
      return {
        success: true,
        message: 'Shipment created successfully',
        data: shipment,
      };
    } catch (error) {
      this.loggerService.error('Error creating shipment', error);
      throw error;
    }
  }

  @Get('shipments')
  @ApiQuery({ name: 'orderId', required: false, type: Number, description: 'Filter by order ID' })
  @ApiQuery({ name: 'status', required: false, enum: ShippingStatus, description: 'Filter by shipment status' })
  @ApiQuery({ name: 'carrier', required: false, enum: CarrierType, description: 'Filter by carrier' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'Shipments fetched', type: [ShipmentResponseDto] })
  async getShipments(
    @Query('orderId') orderId?: number,
    @Query('status') status?: ShippingStatus,
    @Query('carrier') carrier?: CarrierType,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    try {
      const shipments = await this.shippingService.findAllShipments({
        orderId,
        status,
        carrier,
        limit,
        offset,
      });

      return {
        success: true,
        message: 'Shipments fetched successfully',
        data: shipments,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipments', error);
      throw error;
    }
  }

  @Get('shipments/:id')
  @ApiResponse({ status: 200, description: 'Shipment found', type: ShipmentResponseDto })
  async getShipment(@Param('id', ParseIntPipe) id: number) {
    try {
      const shipment = await this.shippingService.findOneShipment(id);
      return {
        success: true,
        message: 'Shipment fetched successfully',
        data: shipment,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipment', error);
      throw error;
    }
  }

  @Get('shipments/tracking/:shipmentNumber')
  @ApiResponse({ status: 200, description: 'Shipment by tracking number found', type: ShipmentResponseDto })
  async getShipmentByTrackingNumber(@Param('shipmentNumber') shipmentNumber: string) {
    try {
      const shipment = await this.shippingService.findByShipmentNumber(shipmentNumber);
      return {
        success: true,
        message: 'Shipment fetched successfully',
        data: shipment,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipment by tracking number', error);
      throw error;
    }
  }

  @Patch('shipments/:id/status')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Shipment status updated', type: ShipmentResponseDto })
  async updateShipmentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateShipmentStatusDto,
  ) {
    try {
      const shipment = await this.shippingService.updateShipmentStatus(id, updateStatusDto);
      return {
        success: true,
        message: 'Shipment status updated successfully',
        data: shipment,
      };
    } catch (error) {
      this.loggerService.error('Error updating shipment status', error);
      throw error;
    }
  }

  @Delete('shipments/:id')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Shipment deleted' })
  async removeShipment(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.shippingService.removeShipment(id);
      return {
        success: true,
        message: 'Shipment deleted successfully',
      };
    } catch (error) {
      this.loggerService.error('Error deleting shipment', error);
      throw error;
    }
  }

  // Shipping Calculation Endpoint
  @Post('calculate')
  @ApiResponse({ status: 200, description: 'Shipping cost calculated', type: ShippingCalculationResponseDto })
  async calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    try {
      const calculation = await this.shippingService.calculateShipping(calculateShippingDto);
      return {
        success: true,
        message: 'Shipping cost calculated successfully',
        data: calculation,
      };
    } catch (error) {
      this.loggerService.error('Error calculating shipping cost', error);
      throw error;
    }
  }

  // Shipping Statistics Endpoint
  @Get('stats')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Shipping statistics fetched', type: ShippingStatsDto })
  async getShippingStats() {
    try {
      const stats = await this.shippingService.getShippingStats();
      return {
        success: true,
        message: 'Shipping statistics fetched successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error fetching shipping statistics', error);
      throw error;
    }
  }
}
