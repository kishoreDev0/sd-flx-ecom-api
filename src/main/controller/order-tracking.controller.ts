import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrderTrackingService } from '../service/order-tracking.service';
import { NotificationService } from '../service/notification.service';
import { AuthGuard } from '../commons/guards/auth.guard';
import { CommonUtilService } from '../utils/common.util';
import {
  CreateOrderTrackingDto,
  UpdateOrderStatusDto,
  ShipOrderDto,
  DeliverOrderDto,
  CancelOrderDto,
} from '../dto/requests/order-tracking/create-order-tracking.dto';
import {
  OrderTrackingResponseWrapper,
  OrderTrackingHistoryResponseWrapper,
  OrderTrackingStatsResponseWrapper,
} from '../dto/responses/order-tracking-response.dto';
import { LoggerService } from '../service/logger.service';

@ApiTags('Order Tracking')
@Controller('v1/order-tracking')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class OrderTrackingController {
  constructor(
    private readonly orderTrackingService: OrderTrackingService,
    private readonly notificationService: NotificationService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create order tracking entry' })
  @ApiResponse({ status: 201, type: OrderTrackingResponseWrapper })
  async createTrackingEntry(
    @Body() createOrderTrackingDto: CreateOrderTrackingDto,
    @Request() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const trackingEntry = await this.orderTrackingService.createTrackingEntry({
        ...createOrderTrackingDto,
        status: createOrderTrackingDto.status as any, // Convert enum
        estimatedDelivery: createOrderTrackingDto.estimatedDelivery ? new Date(createOrderTrackingDto.estimatedDelivery) : undefined,
        createdBy: userId,
      });

      return {
        success: true,
        message: 'Order tracking entry created successfully',
        data: trackingEntry,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Put(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, type: OrderTrackingResponseWrapper })
  async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const trackingEntry = await this.orderTrackingService.updateOrderStatus(
        orderId,
        updateOrderStatusDto.status,
        {
          ...updateOrderStatusDto,
          estimatedDelivery: updateOrderStatusDto.estimatedDelivery ? new Date(updateOrderStatusDto.estimatedDelivery) : undefined,
          actualDelivery: updateOrderStatusDto.actualDelivery ? new Date(updateOrderStatusDto.actualDelivery) : undefined,
          createdBy: userId,
        },
      );

      return {
        success: true,
        message: 'Order status updated successfully',
        data: trackingEntry,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Put(':orderId/ship')
  @ApiOperation({ summary: 'Mark order as shipped' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, type: OrderTrackingResponseWrapper })
  async shipOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() shipOrderDto: ShipOrderDto,
    @Request() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const trackingEntry = await this.orderTrackingService.markOrderAsShipped(
        orderId,
        {
          ...shipOrderDto,
          estimatedDelivery: shipOrderDto.estimatedDelivery ? new Date(shipOrderDto.estimatedDelivery) : undefined,
          createdBy: userId,
        },
      );

      return {
        success: true,
        message: 'Order marked as shipped successfully',
        data: trackingEntry,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Put(':orderId/deliver')
  @ApiOperation({ summary: 'Mark order as delivered' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, type: OrderTrackingResponseWrapper })
  async deliverOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() deliverOrderDto: DeliverOrderDto,
    @Request() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const trackingEntry = await this.orderTrackingService.markOrderAsDelivered(
        orderId,
        {
          ...deliverOrderDto,
          actualDelivery: deliverOrderDto.actualDelivery ? new Date(deliverOrderDto.actualDelivery) : undefined,
          createdBy: userId,
        },
      );

      return {
        success: true,
        message: 'Order marked as delivered successfully',
        data: trackingEntry,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Put(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, type: OrderTrackingResponseWrapper })
  async cancelOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() cancelOrderDto: CancelOrderDto,
    @Request() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const trackingEntry = await this.orderTrackingService.cancelOrder(
        orderId,
        cancelOrderDto.reason,
        userId,
      );

      return {
        success: true,
        message: 'Order cancelled successfully',
        data: trackingEntry,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get(':orderId/history')
  @ApiOperation({ summary: 'Get order tracking history' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, type: OrderTrackingHistoryResponseWrapper })
  async getOrderTrackingHistory(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    try {
      const trackingHistory = await this.orderTrackingService.getOrderTrackingHistory(orderId);
      const latestTracking = await this.orderTrackingService.getLatestTrackingStatus(orderId);

      return {
        success: true,
        message: 'Order tracking history retrieved successfully',
        data: {
          orderId,
          trackingHistory,
          currentStatus: latestTracking.status,
          latestTracking,
        },
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get(':orderId/latest')
  @ApiOperation({ summary: 'Get latest tracking status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, type: OrderTrackingResponseWrapper })
  async getLatestTrackingStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    try {
      const latestTracking = await this.orderTrackingService.getLatestTrackingStatus(orderId);

      return {
        success: true,
        message: 'Latest tracking status retrieved successfully',
        data: latestTracking,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get order tracking statistics' })
  @ApiResponse({ status: 200, type: OrderTrackingStatsResponseWrapper })
  async getTrackingStats() {
    try {
      const stats = await this.orderTrackingService.getTrackingStats();

      return {
        success: true,
        message: 'Order tracking statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
