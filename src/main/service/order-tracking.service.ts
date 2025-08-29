import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderTrackingRepository } from '../repository/order-tracking.repository';
import { OrderRepository } from '../repository/order.repository';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';
import { OrderTracking, OrderStatus as TrackingOrderStatus } from '../entities/order-tracking.entity';
import { OrderStatus } from '../entities/order.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class OrderTrackingService {
  constructor(
    private readonly orderTrackingRepository: OrderTrackingRepository,
    private readonly orderRepository: OrderRepository,
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
  ) {}

  async createTrackingEntry(data: {
    orderId: number;
    status: TrackingOrderStatus;
    statusDescription?: string;
    location?: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    createdBy: number;
  }): Promise<OrderTracking> {
    try {
      // Verify order exists
      const order = await this.orderRepository.findById(data.orderId);
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const trackingEntry = await this.orderTrackingRepository.createTracking({
        ...data,
        isNotificationSent: false,
      });

      // Send notification for status change
      await this.sendStatusChangeNotification(trackingEntry, order);

      this.logger.info('Order tracking entry created', {
        trackingId: trackingEntry.id,
        orderId: data.orderId,
        status: data.status,
      });

      return trackingEntry;
    } catch (error) {
      this.logger.error('Error creating tracking entry', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, status: TrackingOrderStatus, data: {
    statusDescription?: string;
    location?: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    createdBy: number;
  }): Promise<OrderTracking> {
    try {
      // Verify order exists
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Create new tracking entry
      const trackingEntry = await this.createTrackingEntry({
        orderId,
        status,
        ...data,
      });

      // Convert tracking status to order status
      let orderStatus: OrderStatus;
      switch (status) {
        case TrackingOrderStatus.PENDING:
          orderStatus = OrderStatus.PENDING;
          break;
        case TrackingOrderStatus.CONFIRMED:
        case TrackingOrderStatus.PROCESSING:
          orderStatus = OrderStatus.PROCESSING;
          break;
        case TrackingOrderStatus.SHIPPED:
        case TrackingOrderStatus.OUT_FOR_DELIVERY:
          orderStatus = OrderStatus.SHIPPED;
          break;
        case TrackingOrderStatus.DELIVERED:
          orderStatus = OrderStatus.DELIVERED;
          break;
        case TrackingOrderStatus.CANCELLED:
        case TrackingOrderStatus.RETURNED:
        case TrackingOrderStatus.REFUNDED:
          orderStatus = OrderStatus.CANCELLED;
          break;
        default:
          orderStatus = OrderStatus.PENDING;
      }

      // Update order status
      await this.orderRepository.update(orderId, { status: orderStatus });

      this.logger.info('Order status updated', {
        orderId,
        status,
        trackingId: trackingEntry.id,
      });

      return trackingEntry;
    } catch (error) {
      this.logger.error('Error updating order status', error);
      throw error;
    }
  }

  async getOrderTrackingHistory(orderId: number): Promise<OrderTracking[]> {
    try {
      const trackingHistory = await this.orderTrackingRepository.getOrderTrackingHistory(orderId);
      
      this.logger.info('Order tracking history retrieved', { orderId, count: trackingHistory.length });
      
      return trackingHistory;
    } catch (error) {
      this.logger.error('Error getting order tracking history', error);
      throw error;
    }
  }

  async getLatestTrackingStatus(orderId: number): Promise<OrderTracking> {
    try {
      const latestTracking = await this.orderTrackingRepository.findLatestByOrderId(orderId);
      
      if (!latestTracking) {
        throw new NotFoundException('No tracking information found for this order');
      }

      return latestTracking;
    } catch (error) {
      this.logger.error('Error getting latest tracking status', error);
      throw error;
    }
  }

  async updateTrackingDetails(trackingId: number, data: {
    statusDescription?: string;
    location?: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  }): Promise<OrderTracking> {
    try {
      const trackingEntry = await this.orderTrackingRepository.updateTracking(trackingId, data);
      
      this.logger.info('Tracking details updated', { trackingId, orderId: trackingEntry.orderId });
      
      return trackingEntry;
    } catch (error) {
      this.logger.error('Error updating tracking details', error);
      throw error;
    }
  }

  async markOrderAsShipped(orderId: number, data: {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery?: Date;
    createdBy: number;
  }): Promise<OrderTracking> {
    try {
      const trackingEntry = await this.updateOrderStatus(orderId, TrackingOrderStatus.SHIPPED, {
        statusDescription: `Order shipped via ${data.carrier}`,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        estimatedDelivery: data.estimatedDelivery,
        createdBy: data.createdBy,
      });

      // Send shipped notification
      const order = await this.orderRepository.findById(orderId);
      if (order) {
        await this.notificationService.sendOrderShippedNotification(
          orderId,
          order.user.id,
          data.trackingNumber,
          data.carrier
        );
      }

      return trackingEntry;
    } catch (error) {
      this.logger.error('Error marking order as shipped', error);
      throw error;
    }
  }

  async markOrderAsDelivered(orderId: number, data: {
    actualDelivery?: Date;
    createdBy: number;
  }): Promise<OrderTracking> {
    try {
      const trackingEntry = await this.updateOrderStatus(orderId, TrackingOrderStatus.DELIVERED, {
        statusDescription: 'Order delivered successfully',
        actualDelivery: data.actualDelivery || new Date(),
        createdBy: data.createdBy,
      });

      // Send delivered notification
      const order = await this.orderRepository.findById(orderId);
      if (order) {
        await this.notificationService.sendOrderDeliveredNotification(orderId, order.user.id);
      }

      return trackingEntry;
    } catch (error) {
      this.logger.error('Error marking order as delivered', error);
      throw error;
    }
  }

  async cancelOrder(orderId: number, reason: string, createdBy: number): Promise<OrderTracking> {
    try {
      const trackingEntry = await this.updateOrderStatus(orderId, TrackingOrderStatus.CANCELLED, {
        statusDescription: `Order cancelled: ${reason}`,
        createdBy,
      });

      // Send cancellation notification
      const order = await this.orderRepository.findById(orderId);
      if (order) {
        await this.notificationService.createNotification({
          userId: order.user.id,
          type: 'order_cancelled' as any,
          title: 'Order Cancelled',
          message: `Your order #${orderId} has been cancelled. Reason: ${reason}`,
          priority: 'high' as any,
          metadata: { orderId, reason },
        });
      }

      return trackingEntry;
    } catch (error) {
      this.logger.error('Error cancelling order', error);
      throw error;
    }
  }

  async getOrdersByStatus(status: TrackingOrderStatus): Promise<OrderTracking[]> {
    try {
      return await this.orderTrackingRepository.getOrdersByStatus(status);
    } catch (error) {
      this.logger.error('Error getting orders by status', error);
      throw error;
    }
  }

  async getTrackingStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  }> {
    try {
      return await this.orderTrackingRepository.getTrackingStats();
    } catch (error) {
      this.logger.error('Error getting tracking stats', error);
      throw error;
    }
  }

  private async sendStatusChangeNotification(trackingEntry: OrderTracking, order: any): Promise<void> {
    try {
      await this.notificationService.sendOrderStatusNotification(
        trackingEntry.orderId,
        order.user.id,
        trackingEntry.status,
        {
          orderId: order.id,
          totalAmount: order.totalAmount,
          status: trackingEntry.status,
          trackingNumber: trackingEntry.trackingNumber,
          carrier: trackingEntry.carrier,
        }
      );

      // Mark notification as sent
      await this.orderTrackingRepository.markNotificationSent(trackingEntry.id);
    } catch (error) {
      this.logger.error('Error sending status change notification', error);
    }
  }
}
