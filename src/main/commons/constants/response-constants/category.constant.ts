import { HttpStatus } from '@nestjs/common';
import { CategoryResponseDto } from 'src/main/dto/responses/category-response.dto'; 

export const CATEGORY_RESPONSES = {
  CATEGORY_NOT_FOUND: () => ({
    success: false,
    message: 'Category not found',
    statusCode: HttpStatus.NOT_FOUND,
    data: null,
  }),

  CATEGORY_CREATED: (data: CategoryResponseDto) => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Category created successfully',
    data,
  }),

  CATEGORY_UPDATED: (data: CategoryResponseDto) => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Category updated successfully',
    data,
  }),

  CATEGORY_DELETED: () => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Category deleted successfully',
  }),

  CATEGORIES_FETCHED: (data: CategoryResponseDto[]) => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Categories fetched successfully',
    data,
  }),
};
