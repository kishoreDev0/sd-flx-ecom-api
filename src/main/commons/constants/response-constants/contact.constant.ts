import { HttpStatus } from '@nestjs/common';
import { GenericResponseDto } from 'src/main/dto/responses/generics/generic-response.dto';
import {
  ContactResponseDto,
  ContactResponseWrapper,
  ContactsResponseWrapper,
} from 'src/main/dto/responses/contact-response.dto';

export const CONTACT_RESPONSES = {
  CONTACT_NOT_FOUND: (): GenericResponseDto<null> => ({
    success: false,
    message: 'Contact not found',
    statusCode: HttpStatus.NOT_FOUND,
    data: null,
  }),

  CONTACTS_NOT_FOUND: (): {
    statusCode: number;
    message: string;
    success: boolean;
    data: [];
  } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'No contacts found',
    data: [],
  }),

  CONTACT_CREATED: (data: ContactResponseDto): ContactResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Contact created successfully',
    data,
  }),
  

  CONTACT_UPDATED: (data: ContactResponseDto): ContactResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Contact updated successfully',
    data,
  }),

  CONTACT_FETCHED: (data: ContactResponseDto): ContactResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Contact fetched successfully',
    data,
  }),

  CONTACTS_FETCHED: (data: ContactResponseDto[]): ContactsResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Contacts fetched successfully',
    data,
  }),

  CONTACT_DELETED: (id: number): ContactResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: `Contact with ID ${id} deleted successfully`,
    data: null,
  }),
};
