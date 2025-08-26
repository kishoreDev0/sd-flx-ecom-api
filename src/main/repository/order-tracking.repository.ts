import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderTracking, OrderStatus } from '../entities/order-tracking.entity';

@Injectable()
export class OrderTrackingRepository extends Repository<OrderTracking> {
  constructor(private dataSource: DataSource) {
    super(OrderTracking, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<OrderTracking> {
    return this.findOne({
      where: { id },
      relations: ['order', 'user'],
    });
  }

  async findByOrderId(orderId: number): Promise<OrderTracking[]> {
    return this.find({
      where: { orderId },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLatestByOrderId(orderId: number): Promise<OrderTracking> {
    return this.findOne({
      where: { orderId },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: OrderStatus): Promise<OrderTracking[]> {
    return this.find({
      where: { status },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingNotifications(): Promise<OrderTracking[]> {
    return this.find({
      where: { isNotificationSent: false },
      relations: ['order', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

  async createTracking(trackingData: Partial<OrderTracking>): Promise<OrderTracking> {
    const tracking = this.create(trackingData);
    return this.save(tracking);
  }

  async updateTracking(id: number, trackingData: Partial<OrderTracking>): Promise<OrderTracking> {
    await this.update(id, trackingData);
    return this.findById(id);
  }

  async markNotificationSent(id: number): Promise<void> {
    await this.update(id, {
      isNotificationSent: true,
      notificationSentAt: new Date(),
    });
  }

  async getOrderTrackingHistory(orderId: number): Promise<OrderTracking[]> {
    return this.find({
      where: { orderId },
      relations: ['order', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderTracking[]> {
    return this.find({
      where: { status },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersNeedingNotification(): Promise<OrderTracking[]> {
    return this.find({
      where: { isNotificationSent: false },
      relations: ['order', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getTrackingStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  }> {
    const [total, pending, shipped, delivered, cancelled] = await Promise.all([
      this.count(),
      this.count({ where: { status: OrderStatus.PENDING } }),
      this.count({ where: { status: OrderStatus.SHIPPED } }),
      this.count({ where: { status: OrderStatus.DELIVERED } }),
      this.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    return {
      totalOrders: total,
      pendingOrders: pending,
      shippedOrders: shipped,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
    };
  }
}
