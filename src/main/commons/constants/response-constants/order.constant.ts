import { HttpStatus } from '@nestjs/common';
import {
  OrderResponseDto,
  OrderResponseWrapper,
  OrdersResponseWrapper,
} from 'src/main/dto/responses/order-response.dto';
import { GenericResponseDto } from 'src/main/dto/responses/generics/generic-response.dto';

export const ORDER_RESPONSES = {
  ORDER_NOT_FOUND: (): OrderResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Order not found',
    data: null,
  }),

  ORDERS_NOT_FOUND: (): OrdersResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Orders not found',
    data: [],
  }),
   SUBSCRIBE_SUCCESS: (): OrderResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.OK,
    message: 'Subscription successful',
   
  }),

  ORDER_ALREADY_EXISTS: (): GenericResponseDto<null> => ({
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: 'Order already exists for this user',
  }),

  ORDERS_FETCHED: (data: OrderResponseDto[]): OrdersResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Orders fetched successfully',
    data,
  }),

  ORDERS_FETCHED_BY_USER_ID: (data: OrderResponseDto[]): OrdersResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Orders fetched successfully for user',
    data,
  }),

  ORDERS_FETCHED_BY_STATUS: (data: OrderResponseDto[]): OrdersResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Orders fetched successfully by status',
    data,
  }),

  ORDER_FETCHED: (data: OrderResponseDto): OrderResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Order fetched successfully',
    data,
  }),

  ORDER_CREATED: (data: OrderResponseDto): OrderResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Order created successfully',
    data,
  }),

  ORDER_UPDATED: (data: OrderResponseDto): OrderResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Order updated successfully',
    data,
  }),

  ORDER_STATUS_UPDATED: (data: OrderResponseDto): OrderResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Order status updated successfully',
    data,
  }),

  ORDER_DELETED: (id: number): OrderResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: `Order with ID ${id} deleted successfully`,
    data: null,
  }),
};
