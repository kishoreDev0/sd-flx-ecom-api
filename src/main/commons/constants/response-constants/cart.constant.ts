import { HttpStatus } from '@nestjs/common';
import {
  CartResponseDto,
  CartResponseWrapper,
  CartsResponseWrapper,
} from 'src/main/dto/responses/cart-response.dto';
import { GenericResponseDto } from 'src/main/dto/responses/generics/generic-response.dto';

export const CART_RESPONSES = { 
  CART_NOT_FOUND: (): CartResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Cart not found',
    data: null,
  }),
  CARTS_NOT_FOUND: (): CartsResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Cart not found',
    data: [],
  }),

  USER_HAS_ALREADY_PRESENT: (): GenericResponseDto<null> => ({
    success: false,
    statusCode: HttpStatus.AMBIGUOUS,
    message: 'User has already present',
  }),
  

  CARTS_FETCHED: (data: CartResponseDto[]): CartsResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Carts fetched successfully',
    data,
  }),
   CARTS_FETCHED_BY_USER_ID: (data: CartResponseDto): CartResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Carts fetched successfully',
    data,
  }),

  CART_FETCHED: (data: CartResponseDto): CartResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Cart fetched successfully',
    data,
  }),

  CART_CREATED: (data: CartResponseDto): CartResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Cart created successfully',
    data,
  }),

  CART_UPDATED: (data: CartResponseDto): CartResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Cart updated successfully',
    data,
  }),

  CART_DELETED: (id: number): CartResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: `Cart with ID ${id} deleted successfully`,
    data: null,
  }),
};
