import { HttpStatus } from '@nestjs/common';
import { GenericResponseDto } from 'src/main/dto/responses/generics/generic-response.dto';
import {
  FeatureResponseDto,
  FeatureResponseWrapper,
  FeaturesResponseWrapper,
} from 'src/main/dto/responses/feature.response.dto';

export const FEATURE_RESPONSES = {
  FEATURE_NOT_FOUND: (): GenericResponseDto<null> => ({
    success: false,
    message: 'Feature not found',
    statusCode: HttpStatus.NOT_FOUND,
    data: null,
  }),

  FEATURES_NOT_FOUND: (): {
    statusCode: number;
    message: string;
    success: boolean;
  } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'No features found',
  }),

  FEATURE_CREATED: (data: FeatureResponseDto): FeatureResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Feature created successfully',
    data,
  }),
  

  FEATURE_UPDATED: (data: FeatureResponseDto): FeatureResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Feature updated successfully',
    data,
  }),

  FEATURE_FETCHED: (data: FeatureResponseDto): FeatureResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Feature fetched successfully',
    data,
  }),

  FEATURES_FETCHED: (data: FeatureResponseDto[]): FeaturesResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Features fetched successfully',
    data,
  }),

  FEATURE_DELETED: (id: number): FeatureResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: `Feature with ID ${id} deleted successfully`,
    data: null,
  }),
};
