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
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/requests/order/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/order/update-order.dto';
import { OrderStatusUpdateDto } from '../dto/requests/order/order-status-update.dto';
import { OrderResponseDto } from '../dto/responses/order-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { Roles } from '../commons/enumerations/role.enum';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';
import { OrderStatus } from '../entities/order.entity';

@ApiTags('orders')
@Controller('v1/orders')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeadersForAuth()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN, Roles.VENDOR, Roles.CUSTOMER)
  @ApiResponse({ status: 201, description: 'Order created', type: OrderResponseDto })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.create(createOrderDto);
      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error creating order', error);
      throw error;
    }
  }

  @Get()
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter by user ID' })
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter by vendor ID' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by order status' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'Orders fetched', type: [OrderResponseDto] })
  async findAll(
    @Query('userId') userId?: number,
    @Query('vendorId') vendorId?: number,
    @Query('status') status?: OrderStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    try {
      const orders = await this.orderService.findAll({
        userId,
        vendorId,
        status,
        limit,
        offset,
      });

      return {
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      this.loggerService.error('Error fetching orders', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter stats by user ID' })
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter stats by vendor ID' })
  @ApiResponse({ status: 200, description: 'Order statistics fetched' })
  async getStats(
    @Query('userId') userId?: number,
    @Query('vendorId') vendorId?: number,
  ) {
    try {
      const stats = await this.orderService.getOrderStats(userId, vendorId);
      return {
        success: true,
        message: 'Order statistics fetched successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error fetching order stats', error);
      throw error;
    }
  }

  @Get('my-orders')
  @RequireRoles(Roles.CUSTOMER)
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by order status' })
  @ApiResponse({ status: 200, description: 'User orders fetched', type: [OrderResponseDto] })
  async getMyOrders(
    @Req() req: any,
    @Query('status') status?: OrderStatus,
  ) {
    try {
      // Get user ID from request headers
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const orders = await this.orderService.findAll({ userId, status });
      
      return {
        success: true,
        message: 'Your orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      this.loggerService.error('Error fetching user orders', error);
      throw error;
    }
  }

  @Get('vendor-orders')
  @RequireRoles(Roles.VENDOR)
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by order status' })
  @ApiResponse({ status: 200, description: 'Vendor orders fetched', type: [OrderResponseDto] })
  async getVendorOrders(
    @Req() req: any,
    @Query('status') status?: OrderStatus,
  ) {
    try {
      // Get vendor ID from request headers or user context
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      // You might need to get vendor ID from user context
      const vendorId = userId; // This should be the vendor ID
      const orders = await this.orderService.findAll({ vendorId, status });
      
      return {
        success: true,
        message: 'Vendor orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      this.loggerService.error('Error fetching vendor orders', error);
      throw error;
    }
  }

  @Get('number/:orderNumber')
  @ApiResponse({ status: 200, description: 'Order found by number', type: OrderResponseDto })
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    try {
      const order = await this.orderService.findByOrderNumber(orderNumber);
      return {
        success: true,
        message: 'Order found successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error finding order by number', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Order found', type: OrderResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.orderService.findOne(id);
      return {
        success: true,
        message: 'Order found successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error finding order', error);
      throw error;
    }
  }

  @Patch(':id')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Order updated', type: OrderResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const order = await this.orderService.update(id, updateOrderDto);
      return {
        success: true,
        message: 'Order updated successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error updating order', error);
      throw error;
    }
  }

  @Patch(':id/status')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Order status updated', type: OrderResponseDto })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusUpdateDto: OrderStatusUpdateDto,
  ) {
    try {
      const order = await this.orderService.updateStatus(id, statusUpdateDto);
      return {
        success: true,
        message: 'Order status updated successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error updating order status', error);
      throw error;
    }
  }

  @Post(':id/cancel')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Order cancelled', type: OrderResponseDto })
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason: string },
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const order = await this.orderService.cancelOrder(id, body.reason, userId);
      return {
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error cancelling order', error);
      throw error;
    }
  }

  @Post(':id/return-request')
  @RequireRoles(Roles.CUSTOMER)
  @ApiResponse({ status: 200, description: 'Return requested', type: OrderResponseDto })
  async requestReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason: string },
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const order = await this.orderService.requestReturn(id, body.reason, userId);
      return {
        success: true,
        message: 'Return request submitted successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error requesting return', error);
      throw error;
    }
  }

  @Post(':id/escalate')
  @RequireRoles(Roles.CUSTOMER, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Order escalated', type: OrderResponseDto })
  async escalateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason: string },
    @Req() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const order = await this.orderService.escalateOrder(id, body.reason, userId);
      return {
        success: true,
        message: 'Order escalated successfully',
        data: order,
      };
    } catch (error) {
      this.loggerService.error('Error escalating order', error);
      throw error;
    }
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Order deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.orderService.remove(id);
      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      this.loggerService.error('Error deleting order', error);
      throw error;
      }
  }
}