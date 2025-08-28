import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderTracking, OrderStatus } from '../entities/order-tracking.entity';

@Injectable()
export class OrderTrackingRepository {
  constructor(
    @InjectRepository(OrderTracking)
    private readonly repo: Repository<OrderTracking>,
  ) {}

  async findById(id: number): Promise<OrderTracking> {
    return this.repo.findOne({
      where: { id },
      relations: ['order', 'user'],
    });
  }

  async findByOrderId(orderId: number): Promise<OrderTracking[]> {
    return this.repo.find({
      where: { orderId },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLatestByOrderId(orderId: number): Promise<OrderTracking> {
    return this.repo.findOne({
      where: { orderId },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: OrderStatus): Promise<OrderTracking[]> {
    return this.repo.find({
      where: { status },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingNotifications(): Promise<OrderTracking[]> {
    return this.repo.find({
      where: { isNotificationSent: false },
      relations: ['order', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

  async createTracking(trackingData: Partial<OrderTracking>): Promise<OrderTracking> {
    const tracking = this.repo.create(trackingData);
    return this.repo.save(tracking);
  }

  async updateTracking(id: number, trackingData: Partial<OrderTracking>): Promise<OrderTracking> {
    await this.repo.update(id, trackingData);
    return this.findById(id);
  }

  async markNotificationSent(id: number): Promise<void> {
    await this.repo.update(id, {
      isNotificationSent: true,
      notificationSentAt: new Date(),
    });
  }

  async getOrderTrackingHistory(orderId: number): Promise<OrderTracking[]> {
    return this.repo.find({
      where: { orderId },
      relations: ['order', 'user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderTracking[]> {
    return this.repo.find({
      where: { status },
      relations: ['order', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersNeedingNotification(): Promise<OrderTracking[]> {
    return this.repo.find({
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
      this.repo.count(),
      this.repo.count({ where: { status: OrderStatus.PENDING } }),
      this.repo.count({ where: { status: OrderStatus.SHIPPED } }),
      this.repo.count({ where: { status: OrderStatus.DELIVERED } }),
      this.repo.count({ where: { status: OrderStatus.CANCELLED } }),
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
