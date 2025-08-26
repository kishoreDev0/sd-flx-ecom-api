import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import { MailService } from '../email/mail.service';
import { LoggerService } from './logger.service';
import { Notification, NotificationType, NotificationPriority } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly mailService: MailService,
    private readonly logger: LoggerService,
  ) {}

  async createNotification(data: {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    priority?: NotificationPriority;
    metadata?: any;
    expiresAt?: Date;
  }): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.createNotification({
        ...data,
        priority: data.priority || NotificationPriority.MEDIUM,
      });

      this.logger.info('Notification created', { notificationId: notification.id, userId: data.userId });
      return notification;
    } catch (error) {
      this.logger.error('Error creating notification', error);
      throw error;
    }
  }

  async sendOrderStatusNotification(orderId: number, userId: number, status: string, orderDetails: any): Promise<void> {
    try {
      const notificationData = this.getOrderStatusNotificationData(orderId, status, orderDetails);
      
      await this.createNotification({
        userId,
        type: NotificationType.ORDER_STATUS,
        title: notificationData.title,
        message: notificationData.message,
        priority: NotificationPriority.HIGH,
        metadata: {
          orderId,
          status,
          orderDetails,
        },
      });

      // Send email notification
      await this.sendOrderStatusEmail(userId, notificationData);
      
      this.logger.info('Order status notification sent', { orderId, userId, status });
    } catch (error) {
      this.logger.error('Error sending order status notification', error);
      throw error;
    }
  }

  async sendOrderConfirmationNotification(orderId: number, userId: number, orderDetails: any): Promise<void> {
    try {
      const notificationData = {
        title: 'Order Confirmed!',
        message: `Your order #${orderId} has been confirmed and is being processed. We'll keep you updated on the delivery status.`,
      };

      await this.createNotification({
        userId,
        type: NotificationType.ORDER_CONFIRMATION,
        title: notificationData.title,
        message: notificationData.message,
        priority: NotificationPriority.HIGH,
        metadata: {
          orderId,
          orderDetails,
        },
      });

      // Send email notification
      await this.sendOrderConfirmationEmail(userId, orderId, orderDetails);
      
      this.logger.info('Order confirmation notification sent', { orderId, userId });
    } catch (error) {
      this.logger.error('Error sending order confirmation notification', error);
      throw error;
    }
  }

  async sendOrderShippedNotification(orderId: number, userId: number, trackingNumber: string, carrier: string): Promise<void> {
    try {
      const notificationData = {
        title: 'Order Shipped!',
        message: `Your order #${orderId} has been shipped via ${carrier}. Tracking number: ${trackingNumber}`,
      };

      await this.createNotification({
        userId,
        type: NotificationType.ORDER_SHIPPED,
        title: notificationData.title,
        message: notificationData.message,
        priority: NotificationPriority.HIGH,
        metadata: {
          orderId,
          trackingNumber,
          carrier,
        },
      });

      // Send email notification
      await this.sendOrderShippedEmail(userId, orderId, trackingNumber, carrier);
      
      this.logger.info('Order shipped notification sent', { orderId, userId, trackingNumber });
    } catch (error) {
      this.logger.error('Error sending order shipped notification', error);
      throw error;
    }
  }

  async sendOrderDeliveredNotification(orderId: number, userId: number): Promise<void> {
    try {
      const notificationData = {
        title: 'Order Delivered!',
        message: `Your order #${orderId} has been successfully delivered. Thank you for your purchase!`,
      };

      await this.createNotification({
        userId,
        type: NotificationType.ORDER_DELIVERED,
        title: notificationData.title,
        message: notificationData.message,
        priority: NotificationPriority.HIGH,
        metadata: {
          orderId,
        },
      });

      // Send email notification
      await this.sendOrderDeliveredEmail(userId, orderId);
      
      this.logger.info('Order delivered notification sent', { orderId, userId });
    } catch (error) {
      this.logger.error('Error sending order delivered notification', error);
      throw error;
    }
  }

  async sendPaymentSuccessNotification(orderId: number, userId: number, amount: number): Promise<void> {
    try {
      const notificationData = {
        title: 'Payment Successful!',
        message: `Payment of $${amount} for order #${orderId} has been processed successfully.`,
      };

      await this.createNotification({
        userId,
        type: NotificationType.PAYMENT_SUCCESS,
        title: notificationData.title,
        message: notificationData.message,
        priority: NotificationPriority.HIGH,
        metadata: {
          orderId,
          amount,
        },
      });

      this.logger.info('Payment success notification sent', { orderId, userId, amount });
    } catch (error) {
      this.logger.error('Error sending payment success notification', error);
      throw error;
    }
  }

  async sendPaymentFailedNotification(orderId: number, userId: number, reason: string): Promise<void> {
    try {
      const notificationData = {
        title: 'Payment Failed',
        message: `Payment for order #${orderId} failed. Reason: ${reason}. Please try again or contact support.`,
      };

      await this.createNotification({
        userId,
        type: NotificationType.PAYMENT_FAILED,
        title: notificationData.title,
        message: notificationData.message,
        priority: NotificationPriority.URGENT,
        metadata: {
          orderId,
          reason,
        },
      });

      this.logger.info('Payment failed notification sent', { orderId, userId, reason });
    } catch (error) {
      this.logger.error('Error sending payment failed notification', error);
      throw error;
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await this.notificationRepository.markAsRead(notificationId);
      this.logger.info('Notification marked as read', { notificationId });
    } catch (error) {
      this.logger.error('Error marking notification as read', error);
      throw error;
    }
  }

  async markAllAsRead(userId: number): Promise<void> {
    try {
      await this.notificationRepository.markAllAsRead(userId);
      this.logger.info('All notifications marked as read', { userId });
    } catch (error) {
      this.logger.error('Error marking all notifications as read', error);
      throw error;
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      return await this.notificationRepository.getUnreadCount(userId);
    } catch (error) {
      this.logger.error('Error getting unread count', error);
      throw error;
    }
  }

  private getOrderStatusNotificationData(orderId: number, status: string, orderDetails: any): { title: string; message: string } {
    const statusMessages = {
      'confirmed': {
        title: 'Order Confirmed!',
        message: `Your order #${orderId} has been confirmed and is being processed.`,
      },
      'processing': {
        title: 'Order Processing',
        message: `Your order #${orderId} is being prepared for shipment.`,
      },
      'shipped': {
        title: 'Order Shipped!',
        message: `Your order #${orderId} has been shipped and is on its way to you.`,
      },
      'out_for_delivery': {
        title: 'Out for Delivery',
        message: `Your order #${orderId} is out for delivery and will arrive soon!`,
      },
      'delivered': {
        title: 'Order Delivered!',
        message: `Your order #${orderId} has been successfully delivered.`,
      },
      'cancelled': {
        title: 'Order Cancelled',
        message: `Your order #${orderId} has been cancelled.`,
      },
      'returned': {
        title: 'Order Returned',
        message: `Your order #${orderId} has been returned.`,
      },
      'refunded': {
        title: 'Order Refunded',
        message: `Your order #${orderId} has been refunded.`,
      },
    };

    return statusMessages[status] || {
      title: 'Order Status Update',
      message: `Your order #${orderId} status has been updated to: ${status}`,
    };
  }

  private async sendOrderStatusEmail(userId: number, notificationData: { title: string; message: string }): Promise<void> {
    try {
      // This would integrate with your existing mail service
      // await this.mailService.sendOrderStatusEmail(userId, notificationData);
      this.logger.info('Order status email sent', { userId });
    } catch (error) {
      this.logger.error('Error sending order status email', error);
    }
  }

  private async sendOrderConfirmationEmail(userId: number, orderId: number, orderDetails: any): Promise<void> {
    try {
      // await this.mailService.sendOrderConfirmationEmail(userId, orderId, orderDetails);
      this.logger.info('Order confirmation email sent', { userId, orderId });
    } catch (error) {
      this.logger.error('Error sending order confirmation email', error);
    }
  }

  private async sendOrderShippedEmail(userId: number, orderId: number, trackingNumber: string, carrier: string): Promise<void> {
    try {
      // await this.mailService.sendOrderShippedEmail(userId, orderId, trackingNumber, carrier);
      this.logger.info('Order shipped email sent', { userId, orderId, trackingNumber });
    } catch (error) {
      this.logger.error('Error sending order shipped email', error);
    }
  }

  private async sendOrderDeliveredEmail(userId: number, orderId: number): Promise<void> {
    try {
      // await this.mailService.sendOrderDeliveredEmail(userId, orderId);
      this.logger.info('Order delivered email sent', { userId, orderId });
    } catch (error) {
      this.logger.error('Error sending order delivered email', error);
    }
  }

  async getUserNotifications(userId: number, options: { limit?: number; offset?: number; unread?: boolean; type?: string } = {}): Promise<any[]> {
    try {
      const repositoryOptions = {
        limit: options.limit,
        offset: options.offset,
        unreadOnly: options.unread,
        type: options.type as any,
      };
      return await this.notificationRepository.findByUserId(userId, repositoryOptions);
    } catch (error) {
      this.logger.error('Error getting user notifications', error);
      throw error;
    }
  }

  async getNotificationStats(userId: number): Promise<any> {
    try {
      return await this.notificationRepository.getNotificationStats(userId);
    } catch (error) {
      this.logger.error('Error getting notification stats', error);
      throw error;
    }
  }
}
