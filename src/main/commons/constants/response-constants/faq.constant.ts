import { HttpStatus } from '@nestjs/common';
import { FaqResponseDto, FaqResponseWrapper } from 'src/main/dto/responses/faq.response.dto'; 

export const FAQ_RESPONSES = {
  FAQ_NOT_FOUND: () => ({
    success: false,
    message: 'Faq not found',
    statusCode: HttpStatus.NOT_FOUND,
    data: null,
  }),

  FAQ_CREATED: (data: FaqResponseDto): FaqResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Faq created successfully',
    data,
  }),
  FAQ_BY_ID_FETCHED: (data: FaqResponseDto): FaqResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Faq created successfully',
    data,
  }),

  FAQ_UPDATED: (data: FaqResponseDto) => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Faq updated successfully',
    data,
  }),

  FAQ_DELETED: (id:number) => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Faq deleted successfully with ID ' + id,
  }),

  FAQS_FETCHED: (data: FaqResponseDto[]) => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'faqs fetched successfully',
    data,
  }),
};
