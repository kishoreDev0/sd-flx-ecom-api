import { HttpStatus } from '@nestjs/common';
import { RoleAlreadyExistsException } from 'src/main/commons/exceptions/roleName_exists';
import {
  RoleResponseDto,
  RoleResponseWrapper,
  RolesResponseWrapper,
} from 'src/main/dto/responses/role-response.dto';

export const ROLE_RESPONSES = {
  ROLE_ALREADY_EXISTS: (roleName: string): never => {
    throw new RoleAlreadyExistsException(roleName);
  },
  ROLE_NOT_ALLOWED: {
    success: false,
    message: 'You cannot invite user to this role',
    statusCode: HttpStatus.FORBIDDEN,
  },
  ROLE_NOT_FOUND: (
    roleId: number,
  ): { success: boolean; statusCode: number; message: string } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `Role with ID ${roleId} not found`,
  }),
  ROLES_NOT_FOUND: (): {
    success: boolean;
    statusCode: number;
    message: string;
  } => ({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `Roles not found`,
  }),
  ROLE_CREATED: (role: RoleResponseDto): RoleResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Role created successfully',
    data: role,
  }),
  ROLE_UPDATED: (data: RoleResponseDto): RoleResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Role updated successfully',
    data,
  }),

  ROLE_DELETED: {
    success: true,
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Role deleted successfully',
  } as { success: boolean; statusCode: number; message: string },

  ROLES_FETCHED: (role: RoleResponseDto[]): RolesResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Roles fetched successfully',
    data: role,
  }),

  ROLE_FETCHED: (data: RoleResponseDto): RoleResponseWrapper => ({
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Role fetched successfully',
    data,
  }),
};
