import { BrandResponseWrapper, BrandsResponseWrapper } from '../../../dto/responses/brand-response.dto';

export const BRAND_RESPONSES = {
  BRAND_CREATED: (data: any): BrandResponseWrapper => ({
    success: true,
    message: 'Brand created successfully',
    data,
  }),

  BRAND_UPDATED: (data: any): BrandResponseWrapper => ({
    success: true,
    message: 'Brand updated successfully',
    data,
  }),

  BRAND_DELETED: (): BrandResponseWrapper => ({
    success: true,
    message: 'Brand deleted successfully',
    data: null,
  }),

  BRAND_SOFT_DELETED: (): BrandResponseWrapper => ({
    success: true,
    message: 'Brand soft deleted successfully',
    data: null,
  }),

  BRAND_RESTORED: (): BrandResponseWrapper => ({
    success: true,
    message: 'Brand restored successfully',
    data: null,
  }),

  BRAND_FETCHED: (data: any): BrandResponseWrapper => ({
    success: true,
    message: 'Brand retrieved successfully',
    data,
  }),

  BRANDS_FETCHED: (data: any[]): BrandsResponseWrapper => ({
    success: true,
    message: 'Brands retrieved successfully',
    data,
  }),

  BRAND_NOT_FOUND: (): BrandResponseWrapper => ({
    success: false,
    message: 'Brand not found',
    data: null,
  }),

  BRANDS_NOT_FOUND: (): BrandsResponseWrapper => ({
    success: false,
    message: 'No brands found',
    data: [],
  }),

  BRAND_NAME_EXISTS: (): BrandResponseWrapper => ({
    success: false,
    message: 'Brand name already exists',
    data: null,
  }),

  BRAND_HAS_PRODUCTS: (): BrandResponseWrapper => ({
    success: false,
    message: 'Cannot delete brand with associated products',
    data: null,
  }),

  BRAND_STATS_FETCHED: (data: any): BrandResponseWrapper => ({
    success: true,
    message: 'Brand statistics retrieved successfully',
    data,
  }),
};
