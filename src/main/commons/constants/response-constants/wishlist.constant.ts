import { HttpStatus } from '@nestjs/common';
import { GenericResponseDto } from 'src/main/dto/responses/generics/generic-response.dto';
import {
  WishlistResponseDto,
  WishlistResponseWrapper,
  WishlistsResponseWrapper,
} from 'src/main/dto/responses/wishlist-response.dto';

export const WISHLIST_RESPONSES = {
  WISHLIST_NOT_FOUND: (): WishlistResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Wishlist not found',
    data: null,
  }),
  WISHLISTS_NOT_FOUND: (): WishlistsResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Wishlist not found',
    data: [],
  }),
   WISHLISTS_CART_ALREADY_PRESENT: (): WishlistResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Product already added in cart',
    
  }),

  USER_HAS_ALREADY_PRESENT: (): GenericResponseDto<null> => ({
    success: false,
    statusCode: HttpStatus.AMBIGUOUS,
    message: 'User has already present',
  }),
  

  WISHLISTS_FETCHED: (data: WishlistResponseDto[]): WishlistsResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Wishlists fetched successfully',
    data,
  }),
   WISHLISTS_FETCHED_BY_USER_ID: (data: WishlistResponseDto): WishlistResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Wishlists fetched successfully',
    data,
  }),

  WISHLIST_FETCHED: (data: WishlistResponseDto): WishlistResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Wishlist fetched successfully',
    data,
  }),

  WISHLIST_CREATED: (data: WishlistResponseDto): WishlistResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Wishlist created successfully',
    data,
  }),

  WISHLIST_UPDATED: (data: WishlistResponseDto): WishlistResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Wishlist updated successfully',
    data,
  }),
    WISHLIST_MOVED: (data: WishlistResponseDto): WishlistResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Product moved to cart successfully',
    data,
  }),

  WISHLIST_DELETED: (id: number): WishlistResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: `Wishlist with ID ${id} deleted successfully`,
    data: null,
  }),
};
