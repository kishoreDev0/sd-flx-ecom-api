import { HttpStatus } from '@nestjs/common';
import {
  UserSessionResponseDto,
  UserSessionResponseWrapper,
  UserSessionsResponseWrapper,
} from 'src/main/dto/responses/user-session.response.dto';

export const USER_SESSION_RESPONSES = {
  USER_SESSION_NOT_FOUND: (
    sessionId: string,
  ): { statusCode: number; message: string; success: boolean } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `User session with token ${sessionId} not found`,
  }),
  USER_SESSIONS_NOT_FOUND: (): {
    statusCode: number;
    message: string;
    success: boolean;
  } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `User sessions not found`,
  }),
  USER_SESSION_CREATED: (
    data: UserSessionResponseDto,
  ): UserSessionResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'User session created successfully',
    data,
  }),
  USER_SESSION_UPDATED: (
    data: UserSessionResponseDto,
  ): UserSessionResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User session updated successfully',
    data,
  }),

  USER_SESSION_DELETED: {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User session deleted successfully',
  } as { statusCode: number; message: string; success: boolean },

  USER_SESSIONS_FETCHED: (
    data: UserSessionResponseDto[],
  ): UserSessionsResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User sessions fetched successfully',
    data,
  }),
  USER_SESSION_FETCHED: (
    data: UserSessionResponseDto,
  ): UserSessionResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User session fetched successfully',
    data,
  }),
};
