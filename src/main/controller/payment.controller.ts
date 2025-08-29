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
import { PaymentService } from '../service/payment.service';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto, PayoutRequestDto } from '../dto/requests/payment/create-payment.dto';
import { PaymentResponseDto, PaymentStatsDto, CommissionStatsDto } from '../dto/responses/payment-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { Roles } from '../commons/enumerations/role.enum';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';
import { PaymentStatus, PaymentType } from '../entities/payment.entity';
import { PaymentMethod } from '../entities/payment.entity';

@ApiTags('payments')
@Controller('v1/payments')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeadersForAuth()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN, Roles.VENDOR, Roles.CUSTOMER)
  @ApiResponse({ status: 201, description: 'Payment created', type: PaymentResponseDto })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentService.create(createPaymentDto);
      return {
        success: true,
        message: 'Payment created successfully',
        data: payment,
      };
    } catch (error) {
      this.loggerService.error('Error creating payment', error);
      throw error;
    }
  }

  @Get()
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter by user ID' })
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter by vendor ID' })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus, description: 'Filter by payment status' })
  @ApiQuery({ name: 'paymentType', required: false, enum: PaymentType, description: 'Filter by payment type' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'Payments fetched', type: [PaymentResponseDto] })
  async findAll(
    @Query('userId') userId?: number,
    @Query('vendorId') vendorId?: number,
    @Query('status') status?: PaymentStatus,
    @Query('paymentType') paymentType?: PaymentType,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    try {
      const payments = await this.paymentService.findAll({
        userId,
        vendorId,
        status,
        paymentType,
        limit,
        offset,
      });

      return {
        success: true,
        message: 'Payments fetched successfully',
        data: payments,
      };
    } catch (error) {
      this.loggerService.error('Error fetching payments', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter stats by user ID' })
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter stats by vendor ID' })
  @ApiResponse({ status: 200, description: 'Payment statistics fetched', type: PaymentStatsDto })
  async getStats(
    @Query('userId') userId?: number,
    @Query('vendorId') vendorId?: number,
  ) {
    try {
      const stats = await this.paymentService.getPaymentStats(userId, vendorId);
      return {
        success: true,
        message: 'Payment statistics fetched successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error fetching payment stats', error);
      throw error;
    }
  }

  @Get('commission-stats')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Commission statistics fetched', type: CommissionStatsDto })
  async getCommissionStats() {
    try {
      const stats = await this.paymentService.getCommissionStats();
      return {
        success: true,
        message: 'Commission statistics fetched successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error fetching commission stats', error);
      throw error;
    }
  }

  @Get('my-payments')
  @RequireRoles(Roles.CUSTOMER)
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus, description: 'Filter by payment status' })
  @ApiQuery({ name: 'paymentType', required: false, enum: PaymentType, description: 'Filter by payment type' })
  @ApiResponse({ status: 200, description: 'User payments fetched', type: [PaymentResponseDto] })
  async getMyPayments(
    @Req() req: any,
    @Query('status') status?: PaymentStatus,
    @Query('paymentType') paymentType?: PaymentType,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const payments = await this.paymentService.findAll({
        userId,
        status,
        paymentType,
      });

      return {
        success: true,
        message: 'Your payments fetched successfully',
        data: payments,
      };
    } catch (error) {
      this.loggerService.error('Error fetching user payments', error);
      throw error;
    }
  }

  @Get('vendor-payments')
  @RequireRoles(Roles.VENDOR)
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus, description: 'Filter by payment status' })
  @ApiQuery({ name: 'paymentType', required: false, enum: PaymentType, description: 'Filter by payment type' })
  @ApiResponse({ status: 200, description: 'Vendor payments fetched', type: [PaymentResponseDto] })
  async getVendorPayments(
    @Req() req: any,
    @Query('status') status?: PaymentStatus,
    @Query('paymentType') paymentType?: PaymentType,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      // Get vendor ID from user
      const vendorId = await this.getVendorIdFromUserId(userId);
      
      const payments = await this.paymentService.findAll({
        vendorId,
        status,
        paymentType,
      });

      return {
        success: true,
        message: 'Vendor payments fetched successfully',
        data: payments,
      };
    } catch (error) {
      this.loggerService.error('Error fetching vendor payments', error);
      throw error;
    }
  }

  @Get('transaction/:transactionId')
  @ApiResponse({ status: 200, description: 'Payment by transaction ID fetched', type: PaymentResponseDto })
  async findByTransactionId(@Param('transactionId') transactionId: string) {
    try {
      const payment = await this.paymentService.findByTransactionId(transactionId);
      return {
        success: true,
        message: 'Payment fetched successfully',
        data: payment,
      };
    } catch (error) {
      this.loggerService.error('Error fetching payment by transaction ID', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Payment found', type: PaymentResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const payment = await this.paymentService.findOne(id);
      return {
        success: true,
        message: 'Payment fetched successfully',
        data: payment,
      };
    } catch (error) {
      this.loggerService.error('Error fetching payment', error);
      throw error;
    }
  }

  @Post('process')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Payment processed', type: PaymentResponseDto })
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      const payment = await this.paymentService.processPayment(processPaymentDto);
      return {
        success: true,
        message: 'Payment processing initiated',
        data: payment,
      };
    } catch (error) {
      this.loggerService.error('Error processing payment', error);
      throw error;
    }
  }

  @Post('refund')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Payment refunded', type: PaymentResponseDto })
  async refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    try {
      const payment = await this.paymentService.refundPayment(refundPaymentDto);
      return {
        success: true,
        message: 'Payment refunded successfully',
        data: payment,
      };
    } catch (error) {
      this.loggerService.error('Error refunding payment', error);
      throw error;
    }
  }

  @Post('payout-request')
  @RequireRoles(Roles.VENDOR)
  @ApiResponse({ status: 201, description: 'Payout request created', type: PaymentResponseDto })
  async requestPayout(@Body() payoutRequestDto: PayoutRequestDto) {
    try {
      const payout = await this.paymentService.requestPayout(payoutRequestDto);
      return {
        success: true,
        message: 'Payout request submitted successfully',
        data: payout,
      };
    } catch (error) {
      this.loggerService.error('Error requesting payout', error);
      throw error;
    }
  }

  @Get('payouts/pending')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Pending payouts fetched', type: [PaymentResponseDto] })
  async getPendingPayouts() {
    try {
      const payouts = await this.paymentService.findAll({
        paymentType: PaymentType.PAYOUT,
        status: PaymentStatus.PENDING,
      });

      return {
        success: true,
        message: 'Pending payouts fetched successfully',
        data: payouts,
      };
    } catch (error) {
      this.loggerService.error('Error fetching pending payouts', error);
      throw error;
    }
  }

  @Post('payouts/:id/approve')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Payout approved', type: PaymentResponseDto })
  async approvePayout(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    try {
      const approvedById = this.commonUtilService.getUserIdFromRequest(req);
      const payout = await this.paymentService.processPayment({
        paymentId: id,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        processedById: approvedById,
      });

      return {
        success: true,
        message: 'Payout approved successfully',
        data: payout,
      };
    } catch (error) {
      this.loggerService.error('Error approving payout', error);
      throw error;
    }
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Payment deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.paymentService.remove(id);
      return {
        success: true,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      this.loggerService.error('Error deleting payment', error);
      throw error;
    }
  }

  private async getVendorIdFromUserId(userId: number): Promise<number> {
    // This is a simplified implementation
    // In a real application, you would query the vendor table to get the vendor ID
    // For now, we'll assume the user ID is the vendor ID
    return userId;
  }
}
