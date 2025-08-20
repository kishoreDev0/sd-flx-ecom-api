import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from 'src/main/service/role.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CreateRoleDTO } from '../dto/requests/role/createRole.dto';
import { UpdateRoleDTO } from '../dto/requests/role/updateRole.dto';
import {
  RoleResponseWrapper,
  RolesResponseWrapper,
} from '../dto/responses/role-response.dto';

@ApiTags('Role')
@Controller('v1')
@UseGuards(AuthGuard)
@ApiHeadersForAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('role')
  async createRole(
    @Body() createRoleDto: CreateRoleDTO,
  ): Promise<RoleResponseWrapper> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get('roles')
  async getRoles(): Promise<RolesResponseWrapper> {
    return this.roleService.getRoles();
  }

  @Get('role/:id')
  async getRoleById(@Param('id') id: number): Promise<RoleResponseWrapper> {
    return this.roleService.getRoleById(id);
  }

  @Patch('role/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDTO,
  ): Promise<RoleResponseWrapper> {
    return this.roleService.updateRole(id, updateRoleDto);
  }
}
