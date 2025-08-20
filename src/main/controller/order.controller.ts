import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { OrderService } from '../service/order.service';
import { CreateOrderDTO } from '../dto/requests/order/create-order.dto';
import { UpdateOrderDTO, UpdateOrderStatusDTO } from '../dto/requests/order/update-order.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import {
  OrderResponseWrapper,
  OrdersResponseWrapper,
} from '../dto/responses/order-response.dto';

@ApiTags('Orders')
@Controller('v1/orders')
// @UseGuards(AuthGuard)
// @ApiHeadersForAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderDTO): Promise<OrderResponseWrapper> {
    try {
      const result = await this.orderService.create(dto);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDTO,
  ): Promise<OrderResponseWrapper> {
    try {
      return await this.orderService.update(id, dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDTO,
  ): Promise<OrderResponseWrapper> {
    try {
      return await this.orderService.updateStatus(id, dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, description: 'Filter orders by status' })
  async findAll(@Query('status') status?: string): Promise<OrdersResponseWrapper> {
    try {
      if (status) {
        return await this.orderService.getOrdersByStatus(status);
      }
      const result = await this.orderService.getAllOrders();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderResponseWrapper> {
    try {
      const order = await this.orderService.getOrderById(id);
      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('/user/:userId')
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrdersResponseWrapper> {
    try {
      const orders = await this.orderService.getOrdersByUserId(userId);
      return orders;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<OrderResponseWrapper> {
    try {
      return await this.orderService.delete(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('/subscribe/:id')
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  async sendSubscribe(@Param('id', ParseIntPipe) id: number,  @Body('email') email: string){
      try{
         const result = await this.orderService.subscribe(id,email)
         return result ;
      }
      catch(error){
         console.log(error)
      }
  }
}