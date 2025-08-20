import { Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_RESPONSES } from 'src/main/commons/constants/response-constants/role.constant';
import { CreateRoleDTO } from '../dto/requests/role/createRole.dto';
import { UpdateRoleDTO } from '../dto/requests/role/updateRole.dto';
import {
  RoleResponseWrapper,
  RolesResponseWrapper,
} from '../dto/responses/role-response.dto';
import { RoleRepository } from '../repository/role.repository';
import { Roles } from '../commons/enumerations/role.enum';
import { Role } from '../entities/role.entity';
import { LoggerService } from './logger.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly roleRepository: RoleRepository,
  ) {}

  isSuperUserOrUserRole(roleId: number): boolean {
    return [Roles.SUPER_USER, Roles.USER].includes(roleId);
  }
  async createRole(createRoleDto: CreateRoleDTO): Promise<RoleResponseWrapper> {
    const existingRole = await this.roleRepository.findByRoleName(
      createRoleDto.roleName,
    );
    if (existingRole) {
      this.logger.warn(
        `Role with name ${createRoleDto.roleName} already exists`,
      );
      return ROLE_RESPONSES.ROLE_ALREADY_EXISTS(createRoleDto.roleName);
    }

    const role = new Role();
    role.roleName = createRoleDto.roleName;
    role.roleDescription = createRoleDto.roleDescription;
    role.createdBy = createRoleDto.createdBy;

    const savedRole = await this.roleRepository.saveRole(role);
    this.logger.log(`Role created with ID ${savedRole.id}`);
    return ROLE_RESPONSES.ROLE_CREATED(savedRole);
  }

  async getRoles(): Promise<RolesResponseWrapper> {
    this.logger.log('Fetching all roles');
    const roles = await this.roleRepository.getAvailableRoles();
    if (roles.length === 0) {
      this.logger.warn('No roles found');
      return ROLE_RESPONSES.ROLES_NOT_FOUND();
    }
    return ROLE_RESPONSES.ROLES_FETCHED(roles);
  }

  async getRoleById(roleId: number): Promise<RoleResponseWrapper> {
    this.logger.log(`Fetching role with ID ${roleId}`);
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) {
      this.logger.warn(`Role with ID ${roleId} not found`);
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    return ROLE_RESPONSES.ROLE_FETCHED(role);
  }

  async updateRole(
    roleId: number,
    updateRoleDto: UpdateRoleDTO,
  ): Promise<RoleResponseWrapper> {
    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) {
      this.logger.warn(`Role with ID ${roleId} not found`);
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    if (updateRoleDto.roleName) {
      const existingRoleName =
        await this.roleRepository.findRoleByNameExcludingRoleId(
          updateRoleDto.roleName,
          roleId,
        );
      if (existingRoleName) {
        this.logger.warn(
          `Role with name ${updateRoleDto.roleName} already exists`,
        );
        return ROLE_RESPONSES.ROLE_ALREADY_EXISTS(updateRoleDto.roleName);
      }
    }
    Object.assign(role, updateRoleDto);
    const updatedRole = await this.roleRepository.saveRole(role);
    this.logger.log(`Role with ID ${roleId} updated`);
    return ROLE_RESPONSES.ROLE_UPDATED(updatedRole);
  }
}
