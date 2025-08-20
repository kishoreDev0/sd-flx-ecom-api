import { HttpStatus } from '@nestjs/common';
import { GenericResponseDto } from 'src/main/dto/responses/generics/generic-response.dto';
import {
  UserResponseDto,
  UserResponseWrapper,
  UsersResponseWrapper,
} from 'src/main/dto/responses/user-response.dto';

export const USER_RESPONSES = {
  USER_IS_NOT_AN_ADMIN: (): UserResponseWrapper => ({
    statusCode: HttpStatus.FORBIDDEN,
    message: `You dont have access to do this operation`,
    success: false,
    data: null,
  }),
  PRIMARY_EMAIL_UDPATED: (message: string): UserResponseWrapper => ({
    statusCode: HttpStatus.OK,
    message: message,
    success: true,
  }),
  USER_ALREADY_EXISTS: (
    userId: number,
  ): { statusCode: number; message: string; success: boolean } => ({
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: `User with ID ${userId} already exists`,
  }),
  USER_NOT_FOUND: (): GenericResponseDto<null> => ({
    success: false,
    message: `User not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),
  SIMILAR_PRIMARY_EMAIL_ID: (): GenericResponseDto<null> => ({
    success: false,
    message: `The primary email ID you are updating is similar to already available email ID`,
    statusCode: HttpStatus.CONFLICT,
  }),
  USERS_NOT_FOUND: (): {
    statusCode: number;
    message: string;
    success: boolean;
  } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `Users not found`,
  }),
  USER_CREATED: (data: UserResponseDto): UserResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'User created successfully',
    data,
  }),
  USER_UPDATED: (data: UserResponseDto): UserResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User updated successfully',
    data,
  }),
  CONTACT_VALUE_ALREADY_EXISTS: (
    data: UserResponseDto,
  ): UserResponseWrapper => ({
    success: false,
    statusCode: HttpStatus.NOT_ACCEPTABLE,
    message: 'This email or phone already exists.',
    data,
  }),
  USER_DELETED: {
    status: HttpStatus.NOT_FOUND,
    message: 'User deleted successfully',
  } as { status: number; message: string },

  USERS_FETCHED: (data: UserResponseDto[]): UsersResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Users fetched successfully',
    data,
  }),
  USER_FETCHED: (data: UserResponseDto): UserResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User fetched successfully',
    data,
  }),
  USER_GET: (
    userResponseDTO: UserResponseDto,
  ): GenericResponseDto<UserResponseDto> => ({
    success: true,
    message: `User retrieved successfully`,
    data: userResponseDTO,
    statusCode: HttpStatus.OK,
  }),
  USER_DEACTIVATED: (id: number): { status: number; message: string } => ({
    status: HttpStatus.NOT_FOUND,
    message: `User with ID: ${id} is Deactivated`,
  }),
  USER_ALREADY_IN_STATE: (
    p0: number,
    state: string,
  ): { statusCode: number; message: string; success: boolean } => ({
    success: false,
    statusCode: HttpStatus.CONFLICT,
    message: `User is already in state: ${state}`,
  }),
  USER_STATE_CHANGED: (
    p0: number,
    state: string,
  ): { statusCode: number; message: string; success: boolean } => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: `User state changed to: ${state}`,
  }),

  USER_EMAIL_ALREADY_EXISTS: () => ({
    success: false,
    message: 'Email already exists',
    statusCode: HttpStatus.CONFLICT,
    data: null,
  }),
};
