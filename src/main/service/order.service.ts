import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Vendor } from '../entities/vendor.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from '../dto/requests/order/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/order/update-order.dto';
import { OrderStatusUpdateDto } from '../dto/requests/order/order-status-update.dto';
import { OrderResponseDto } from '../dto/responses/order-response.dto';
import { NotificationService } from './notification.service';
import { InventoryService } from './inventory.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
    private readonly inventoryService: InventoryService,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  private toOrderResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      vendorId: order.vendorId,
      orderItems: order.orderItems,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentTransactionId: order.paymentTransactionId,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      notes: order.notes,
      vendorNotes: order.vendorNotes,
      adminNotes: order.adminNotes,
      confirmedAt: order.confirmedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      refundedAt: order.refundedAt,
      isReturnRequested: order.isReturnRequested,
      returnReason: order.returnReason,
      returnRequestedAt: order.returnRequestedAt,
      isEscalated: order.isEscalated,
      escalationReason: order.escalationReason,
      escalatedAt: order.escalatedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      createdById: order.createdById,
      updatedById: order.updatedById,
      user: order.user ? {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.officialEmail || '',
      } : undefined,
      vendor: order.vendor ? {
        id: order.vendor.id,
        vendorName: order.vendor.vendorName,
        email: order.vendor.user?.officialEmail || '',
      } : undefined,
      tracking: order.tracking,
    };
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Validate user exists
    const user = await this.userRepository.findOneBy({ id: createOrderDto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate products and calculate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of createOrderDto.orderItems) {
      const product = await this.productRepository.findOneBy({ id: item.productId });
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
        vendorId: product.vendor?.id || 0,
      });
    }

    // Create order
    const order = this.orderRepository.create({
      orderNumber: this.generateOrderNumber(),
      userId: createOrderDto.userId,
      vendorId: createOrderDto.vendorId,
      orderItems,
      subtotal: createOrderDto.subtotal,
      taxAmount: createOrderDto.taxAmount || 0,
      shippingAmount: createOrderDto.shippingAmount || 0,
      discountAmount: createOrderDto.discountAmount || 0,
      totalAmount: createOrderDto.totalAmount,
      status: createOrderDto.status || OrderStatus.PENDING,
      paymentStatus: createOrderDto.paymentStatus || PaymentStatus.PENDING,
      paymentMethod: createOrderDto.paymentMethod,
      paymentTransactionId: createOrderDto.paymentTransactionId,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress,
      customerPhone: createOrderDto.customerPhone,
      customerEmail: createOrderDto.customerEmail,
      notes: createOrderDto.notes,
      createdById: createOrderDto.createdById,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Send notification to customer
    await this.notificationService.create({
      userId: createOrderDto.userId,
      title: 'Order Placed Successfully',
      message: `Your order #${savedOrder.orderNumber} has been placed successfully. We'll keep you updated on the status.`,
      type: NotificationType.ORDER_CONFIRMATION,
      createdBy: createOrderDto.createdById,
    });

    return this.toOrderResponseDto(savedOrder);
  }

  async findAll(options: {
    userId?: number;
    vendorId?: number;
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  } = {}): Promise<OrderResponseDto[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.vendor', 'vendor')
      .leftJoinAndSelect('order.tracking', 'tracking');

    if (options.userId) {
      query.andWhere('order.userId = :userId', { userId: options.userId });
    }

    if (options.vendorId) {
      query.andWhere('order.vendorId = :vendorId', { vendorId: options.vendorId });
    }

    if (options.status) {
      query.andWhere('order.status = :status', { status: options.status });
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    query.orderBy('order.createdAt', 'DESC');

    const orders = await query.getMany();
    return orders.map(order => this.toOrderResponseDto(order));
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponseDto(order);
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponseDto(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update timestamps based on status changes
    if (updateOrderDto.status) {
      switch (updateOrderDto.status) {
        case OrderStatus.CONFIRMED:
          order.confirmedAt = new Date();
          break;
        case OrderStatus.SHIPPED:
          order.shippedAt = new Date();
          break;
        case OrderStatus.DELIVERED:
          order.deliveredAt = new Date();
          break;
        case OrderStatus.CANCELLED:
          order.cancelledAt = new Date();
          break;
        case OrderStatus.REFUNDED:
          order.refundedAt = new Date();
          break;
      }
    }

    // Update return request timestamp
    if (updateOrderDto.isReturnRequested && !order.isReturnRequested) {
      order.returnRequestedAt = new Date();
    }

    // Update escalation timestamp
    if (updateOrderDto.isEscalated && !order.isEscalated) {
      order.escalatedAt = new Date();
    }

    Object.assign(order, updateOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    return this.toOrderResponseDto(savedOrder);
  }

  async updateStatus(id: number, statusUpdateDto: OrderStatusUpdateDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const oldStatus = order.status;
    order.status = statusUpdateDto.status;

    // Update timestamps based on status
    switch (statusUpdateDto.status) {
      case OrderStatus.CONFIRMED:
        order.confirmedAt = new Date();
        break;
      case OrderStatus.SHIPPED:
        order.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        order.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        order.cancelledAt = new Date();
        break;
      case OrderStatus.REFUNDED:
        order.refundedAt = new Date();
        break;
    }

    if (statusUpdateDto.notes) {
      order.vendorNotes = statusUpdateDto.notes;
    }

    const savedOrder = await this.orderRepository.save(order);

    // Send notification to customer about status change
    await this.notificationService.create({
      userId: order.userId,
      title: `Order Status Updated - ${statusUpdateDto.status.toUpperCase()}`,
      message: `Your order #${order.orderNumber} status has been updated to ${statusUpdateDto.status}. ${statusUpdateDto.notes || ''}`,
      type: NotificationType.ORDER_STATUS,
      createdBy: statusUpdateDto.updatedById,
    });

    return this.toOrderResponseDto(savedOrder);
  }

  async cancelOrder(id: number, reason: string, updatedById: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if ([OrderStatus.DELIVERED, OrderStatus.SHIPPED].includes(order.status)) {
      throw new BadRequestException('Cannot cancel order that is already shipped or delivered');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.adminNotes = reason;
    order.updatedById = updatedById;

    const savedOrder = await this.orderRepository.save(order);

    // Send cancellation notification
    await this.notificationService.create({
      userId: order.userId,
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled. Reason: ${reason}`,
      type: NotificationType.ORDER_CANCELLED,
      createdBy: updatedById,
    });

    return this.toOrderResponseDto(savedOrder);
  }

  async requestReturn(id: number, reason: string, userId: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only request return for your own orders');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Can only request return for delivered orders');
    }

    if (order.isReturnRequested) {
      throw new BadRequestException('Return already requested for this order');
    }

    order.isReturnRequested = true;
    order.returnReason = reason;
    order.returnRequestedAt = new Date();

    const savedOrder = await this.orderRepository.save(order);

    // Send return request notification to admin/vendor
    if (order.vendorId) {
      await this.notificationService.create({
        userId: order.vendorId,
        title: 'Return Request',
        message: `Return requested for order #${order.orderNumber}. Reason: ${reason}`,
        type: NotificationType.ORDER_STATUS,
        createdBy: userId,
      });
    }

    return this.toOrderResponseDto(savedOrder);
  }

  async escalateOrder(id: number, reason: string, escalatedById: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'tracking'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.isEscalated) {
      throw new BadRequestException('Order is already escalated');
    }

    order.isEscalated = true;
    order.escalationReason = reason;
    order.escalatedAt = new Date();
    order.updatedById = escalatedById;

    const savedOrder = await this.orderRepository.save(order);

    // Send escalation notification to admin
    await this.notificationService.create({
      userId: 1, // Admin user ID - should be configurable
      title: 'Order Escalated',
      message: `Order #${order.orderNumber} has been escalated. Reason: ${reason}`,
      type: NotificationType.ORDER_STATUS,
      createdBy: escalatedById,
    });

    return this.toOrderResponseDto(savedOrder);
  }

  async getOrderStats(userId?: number, vendorId?: number): Promise<{
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  }> {
    const query = this.orderRepository.createQueryBuilder('order');

    if (userId) {
      query.where('order.userId = :userId', { userId });
    }

    if (vendorId) {
      query.where('order.vendorId = :vendorId', { vendorId });
    }

    const orders = await query.getMany();

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      processingOrders: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
      shippedOrders: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
      deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      cancelledOrders: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === PaymentStatus.COMPLETED)
        .reduce((sum, o) => sum + Number(o.totalAmount), 0),
    };

    return stats;
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.remove(order);
  }
}