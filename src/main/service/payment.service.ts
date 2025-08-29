import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod, PaymentType } from '../entities/payment.entity';
import { PaymentStatus as OrderPaymentStatus } from '../entities/order.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Vendor } from '../entities/vendor.entity';
import { CreatePaymentDto } from '../dto/requests/payment/create-payment.dto';
import { ProcessPaymentDto } from '../dto/requests/payment/create-payment.dto';
import { RefundPaymentDto } from '../dto/requests/payment/create-payment.dto';
import { PayoutRequestDto } from '../dto/requests/payment/create-payment.dto';
import { PaymentResponseDto, PaymentStatsDto, CommissionStatsDto } from '../dto/responses/payment-response.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly notificationService: NotificationService,
  ) {}

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN-${timestamp}-${random}`;
  }

  private toPaymentResponseDto(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      transactionId: payment.transactionId,
      orderId: payment.orderId,
      userId: payment.userId,
      vendorId: payment.vendorId,
      amount: payment.amount,
      commissionAmount: payment.commissionAmount,
      platformFee: payment.platformFee,
      taxAmount: payment.taxAmount,
      netAmount: payment.netAmount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      paymentType: payment.paymentType,
      gatewayTransactionId: payment.gatewayTransactionId,
      gatewayResponse: payment.gatewayResponse,
      description: payment.description,
      failureReason: payment.failureReason,
      processedAt: payment.processedAt,
      failedAt: payment.failedAt,
      refundedAt: payment.refundedAt,
      isRefundable: payment.isRefundable,
      refundReason: payment.refundReason,
      metadata: payment.metadata,
      createdById: payment.createdById,
      updatedById: payment.updatedById,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: payment.user ? {
        id: payment.user.id,
        firstName: payment.user.firstName,
        lastName: payment.user.lastName,
        email: payment.user.officialEmail || '',
      } : undefined,
      vendor: payment.vendor ? {
        id: payment.vendor.id,
        vendorName: payment.vendor.vendorName,
        email: payment.vendor.user?.officialEmail || '',
      } : undefined,
      order: payment.order ? {
        id: payment.order.id,
        orderNumber: payment.order.orderNumber,
        totalAmount: payment.order.totalAmount,
      } : undefined,
    };
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    // Validate user exists
    const user = await this.userRepository.findOneBy({ id: createPaymentDto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate vendor if provided
    if (createPaymentDto.vendorId) {
      const vendor = await this.vendorRepository.findOneBy({ id: createPaymentDto.vendorId });
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
    }

    // Validate order if provided
    if (createPaymentDto.orderId) {
      const order = await this.orderRepository.findOneBy({ id: createPaymentDto.orderId });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
    }

    // Calculate net amount if not provided
    let netAmount = createPaymentDto.netAmount;
    if (!netAmount) {
      netAmount = createPaymentDto.amount - 
        (createPaymentDto.commissionAmount || 0) - 
        (createPaymentDto.platformFee || 0) - 
        (createPaymentDto.taxAmount || 0);
    }

    const payment = this.paymentRepository.create({
      transactionId: this.generateTransactionId(),
      orderId: createPaymentDto.orderId,
      userId: createPaymentDto.userId,
      vendorId: createPaymentDto.vendorId,
      amount: createPaymentDto.amount,
      commissionAmount: createPaymentDto.commissionAmount || 0,
      platformFee: createPaymentDto.platformFee || 0,
      taxAmount: createPaymentDto.taxAmount || 0,
      netAmount,
      status: createPaymentDto.status || PaymentStatus.PENDING,
      paymentMethod: createPaymentDto.paymentMethod,
      paymentType: createPaymentDto.paymentType,
      gatewayTransactionId: createPaymentDto.gatewayTransactionId,
      description: createPaymentDto.description,
      isRefundable: createPaymentDto.isRefundable || false,
      metadata: {
        currency: createPaymentDto.currency || 'USD',
      },
      createdById: createPaymentDto.createdById,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Send notification for payment creation
    await this.notificationService.create({
      userId: createPaymentDto.userId,
      title: 'Payment Created',
      message: `Payment ${savedPayment.transactionId} has been created for ${createPaymentDto.amount} ${createPaymentDto.currency || 'USD'}`,
      type: NotificationType.PAYMENT_SUCCESS,
      createdBy: createPaymentDto.createdById,
    });

    return this.toPaymentResponseDto(savedPayment);
  }

  async findAll(options: {
    userId?: number;
    vendorId?: number;
    status?: PaymentStatus;
    paymentType?: PaymentType;
    limit?: number;
    offset?: number;
  } = {}): Promise<PaymentResponseDto[]> {
    const query = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.vendor', 'vendor')
      .leftJoinAndSelect('payment.order', 'order');

    if (options.userId) {
      query.andWhere('payment.userId = :userId', { userId: options.userId });
    }

    if (options.vendorId) {
      query.andWhere('payment.vendorId = :vendorId', { vendorId: options.vendorId });
    }

    if (options.status) {
      query.andWhere('payment.status = :status', { status: options.status });
    }

    if (options.paymentType) {
      query.andWhere('payment.paymentType = :paymentType', { paymentType: options.paymentType });
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    query.orderBy('payment.createdAt', 'DESC');

    const payments = await query.getMany();
    return payments.map(payment => this.toPaymentResponseDto(payment));
  }

  async findOne(id: number): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'vendor', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.toPaymentResponseDto(payment);
  }

  async findByTransactionId(transactionId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { transactionId },
      relations: ['user', 'vendor', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.toPaymentResponseDto(payment);
  }

  async processPayment(processPaymentDto: ProcessPaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id: processPaymentDto.paymentId },
      relations: ['user', 'vendor', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    // Simulate payment processing
    payment.status = PaymentStatus.PROCESSING;
    payment.paymentMethod = processPaymentDto.paymentMethod;
    payment.gatewayTransactionId = processPaymentDto.gatewayTransactionId;
    payment.gatewayResponse = processPaymentDto.gatewayResponse;
    payment.updatedById = processPaymentDto.processedById;

    // Simulate successful processing after a delay
    setTimeout(async () => {
      payment.status = PaymentStatus.COMPLETED;
      payment.processedAt = new Date();
      await this.paymentRepository.save(payment);

      // Send success notification
      await this.notificationService.create({
        userId: payment.userId,
        title: 'Payment Successful',
        message: `Payment ${payment.transactionId} has been processed successfully`,
        type: NotificationType.PAYMENT_SUCCESS,
        createdBy: processPaymentDto.processedById,
      });

      // Update order payment status if this is an order payment
      if (payment.orderId) {
        const order = await this.orderRepository.findOneBy({ id: payment.orderId });
        if (order) {
          order.paymentStatus = OrderPaymentStatus.COMPLETED;
          await this.orderRepository.save(order);
        }
      }
    }, 2000);

    const savedPayment = await this.paymentRepository.save(payment);
    return this.toPaymentResponseDto(savedPayment);
  }

  async refundPayment(refundPaymentDto: RefundPaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id: refundPaymentDto.paymentId },
      relations: ['user', 'vendor', 'order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.isRefundable) {
      throw new BadRequestException('Payment is not refundable');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment must be completed to be refunded');
    }

    if (refundPaymentDto.refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.refundedAt = new Date();
    payment.refundReason = refundPaymentDto.refundReason;
    payment.updatedById = refundPaymentDto.refundedById;

    const savedPayment = await this.paymentRepository.save(payment);

    // Send refund notification
    await this.notificationService.create({
      userId: payment.userId,
      title: 'Payment Refunded',
      message: `Payment ${payment.transactionId} has been refunded. Amount: ${refundPaymentDto.refundAmount}`,
      type: NotificationType.PAYMENT_SUCCESS,
      createdBy: refundPaymentDto.refundedById,
    });

    return this.toPaymentResponseDto(savedPayment);
  }

  async requestPayout(payoutRequestDto: PayoutRequestDto): Promise<PaymentResponseDto> {
    const vendor = await this.vendorRepository.findOneBy({ id: payoutRequestDto.vendorId });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Calculate available balance for payout
    const completedPayments = await this.paymentRepository.find({
      where: {
        vendorId: payoutRequestDto.vendorId,
        status: PaymentStatus.COMPLETED,
        paymentType: PaymentType.COMMISSION,
      },
    });

    const totalEarnings = completedPayments.reduce((sum, p) => sum + p.netAmount, 0);
    const totalPayouts = await this.paymentRepository.find({
      where: {
        vendorId: payoutRequestDto.vendorId,
        paymentType: PaymentType.PAYOUT,
        status: PaymentStatus.COMPLETED,
      },
    });

    const totalPaidOut = totalPayouts.reduce((sum, p) => sum + p.amount, 0);
    const availableBalance = totalEarnings - totalPaidOut;

    if (payoutRequestDto.amount > availableBalance) {
      throw new BadRequestException(`Insufficient balance. Available: ${availableBalance}`);
    }

    const payout = this.paymentRepository.create({
      transactionId: this.generateTransactionId(),
      vendorId: payoutRequestDto.vendorId,
      userId: payoutRequestDto.requestedById,
      amount: payoutRequestDto.amount,
      netAmount: payoutRequestDto.amount,
      status: PaymentStatus.PENDING,
      paymentType: PaymentType.PAYOUT,
      description: `Payout request for vendor ${vendor.vendorName}`,
      isRefundable: false,
      metadata: {
        payoutMethod: payoutRequestDto.payoutMethod,
        bankAccountNumber: payoutRequestDto.bankAccountNumber,
        bankName: payoutRequestDto.bankName,
        ifscCode: payoutRequestDto.ifscCode,
        upiId: payoutRequestDto.upiId,
      },
      createdById: payoutRequestDto.requestedById,
    });

    const savedPayout = await this.paymentRepository.save(payout);

    // Send payout request notification
    await this.notificationService.create({
      userId: payoutRequestDto.requestedById,
      title: 'Payout Request Submitted',
      message: `Payout request for ${payoutRequestDto.amount} has been submitted`,
      type: NotificationType.GENERAL,
      createdBy: payoutRequestDto.requestedById,
    });

    return this.toPaymentResponseDto(savedPayout);
  }

  async getPaymentStats(userId?: number, vendorId?: number): Promise<PaymentStatsDto> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (userId) {
      query.where('payment.userId = :userId', { userId });
    }

    if (vendorId) {
      query.where('payment.vendorId = :vendorId', { vendorId });
    }

    const payments = await query.getMany();

    const stats = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      totalCommission: payments.reduce((sum, p) => sum + p.commissionAmount, 0),
      totalPlatformFees: payments.reduce((sum, p) => sum + p.platformFee, 0),
      pendingPayments: payments.filter(p => p.status === PaymentStatus.PENDING).length,
      completedPayments: payments.filter(p => p.status === PaymentStatus.COMPLETED).length,
      failedPayments: payments.filter(p => p.status === PaymentStatus.FAILED).length,
      refundedPayments: payments.filter(p => p.status === PaymentStatus.REFUNDED).length,
      paymentsByMethod: this.groupPaymentsByMethod(payments),
      paymentsByType: this.groupPaymentsByType(payments),
    };

    return stats;
  }

  async getCommissionStats(): Promise<CommissionStatsDto> {
    const commissionPayments = await this.paymentRepository.find({
      where: { paymentType: PaymentType.COMMISSION },
      relations: ['vendor'],
    });

    const payoutPayments = await this.paymentRepository.find({
      where: { paymentType: PaymentType.PAYOUT },
    });

    const stats = {
      totalCommissions: commissionPayments.reduce((sum, p) => sum + p.netAmount, 0),
      pendingCommissions: commissionPayments.filter(p => p.status === PaymentStatus.PENDING).reduce((sum, p) => sum + p.netAmount, 0),
      paidCommissions: commissionPayments.filter(p => p.status === PaymentStatus.COMPLETED).reduce((sum, p) => sum + p.netAmount, 0),
      totalPayouts: payoutPayments.reduce((sum, p) => sum + p.amount, 0),
      pendingPayouts: payoutPayments.filter(p => p.status === PaymentStatus.PENDING).reduce((sum, p) => sum + p.amount, 0),
      completedPayouts: payoutPayments.filter(p => p.status === PaymentStatus.COMPLETED).reduce((sum, p) => sum + p.amount, 0),
      commissionsByVendor: this.groupCommissionsByVendor(commissionPayments),
    };

    return stats;
  }

  private groupPaymentsByMethod(payments: Payment[]): any[] {
    const grouped = payments.reduce((acc, payment) => {
      const method = payment.paymentMethod || 'unknown';
      if (!acc[method]) {
        acc[method] = { method, count: 0, amount: 0 };
      }
      acc[method].count++;
      acc[method].amount += payment.amount;
      return acc;
    }, {});

    return Object.values(grouped);
  }

  private groupPaymentsByType(payments: Payment[]): any[] {
    const grouped = payments.reduce((acc, payment) => {
      const type = payment.paymentType;
      if (!acc[type]) {
        acc[type] = { type, count: 0, amount: 0 };
      }
      acc[type].count++;
      acc[type].amount += payment.amount;
      return acc;
    }, {});

    return Object.values(grouped);
  }

  private groupCommissionsByVendor(payments: Payment[]): any[] {
    const grouped = payments.reduce((acc, payment) => {
      const vendorId = payment.vendorId;
      if (!vendorId) return acc;

      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName: payment.vendor?.vendorName || 'Unknown',
          totalCommission: 0,
          pendingCommission: 0,
          paidCommission: 0,
        };
      }

      acc[vendorId].totalCommission += payment.netAmount;
      if (payment.status === PaymentStatus.PENDING) {
        acc[vendorId].pendingCommission += payment.netAmount;
      } else if (payment.status === PaymentStatus.COMPLETED) {
        acc[vendorId].paidCommission += payment.netAmount;
      }

      return acc;
    }, {});

    return Object.values(grouped);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.paymentRepository.remove(payment);
  }
}
