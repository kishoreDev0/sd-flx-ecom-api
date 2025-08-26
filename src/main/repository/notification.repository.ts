import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Notification> {
    return this.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: number, options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    type?: NotificationType;
  }): Promise<Notification[]> {
    const queryBuilder = this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .where('notification.userId = :userId', { userId });

    if (options?.unreadOnly) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
    }

    if (options?.type) {
      queryBuilder.andWhere('notification.type = :type', { type: options.type });
    }

    queryBuilder.orderBy('notification.createdAt', 'DESC');

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    return queryBuilder.getMany();
  }

  async findPendingNotifications(): Promise<Notification[]> {
    return this.find({
      where: { status: NotificationStatus.PENDING },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findFailedNotifications(): Promise<Notification[]> {
    return this.find({
      where: { status: NotificationStatus.FAILED },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.create(notificationData);
    return this.save(notification);
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification> {
    await this.update(id, notificationData);
    return this.findById(id);
  }

  async markAsRead(id: number): Promise<void> {
    await this.update(id, {
      isRead: true,
      readAt: new Date(),
      status: NotificationStatus.READ,
    });
  }

  async markAsSent(id: number): Promise<void> {
    await this.update(id, {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });
  }

  async markAsDelivered(id: number): Promise<void> {
    await this.update(id, {
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date(),
    });
  }

  async markAsFailed(id: number, reason: string): Promise<void> {
    await this.update(id, {
      status: NotificationStatus.FAILED,
      failedAt: new Date(),
      failureReason: reason,
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.count({
      where: { userId, isRead: false },
    });
  }

  async deleteExpiredNotifications(): Promise<void> {
    const now = new Date();
    await this.createQueryBuilder()
      .delete()
      .where('expiresAt IS NOT NULL AND expiresAt < :now', { now })
      .execute();
  }

  async getNotificationStats(userId?: number): Promise<{
    total: number;
    unread: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
  }> {
    const queryBuilder = this.createQueryBuilder('notification');

    if (userId) {
      queryBuilder.where('notification.userId = :userId', { userId });
    }

    const [total, unread, pending, sent, delivered, failed] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.where('notification.isRead = :isRead', { isRead: false }).getCount(),
      queryBuilder.where('notification.status = :status', { status: NotificationStatus.PENDING }).getCount(),
      queryBuilder.where('notification.status = :status', { status: NotificationStatus.SENT }).getCount(),
      queryBuilder.where('notification.status = :status', { status: NotificationStatus.DELIVERED }).getCount(),
      queryBuilder.where('notification.status = :status', { status: NotificationStatus.FAILED }).getCount(),
    ]);

    return {
      total,
      unread,
      pending,
      sent,
      delivered,
      failed,
    };
  }

  async bulkCreateNotifications(notifications: Partial<Notification>[]): Promise<Notification[]> {
    const createdNotifications = this.create(notifications);
    return this.save(createdNotifications);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.update(
      { userId, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
        status: NotificationStatus.READ,
      }
    );
  }
}
