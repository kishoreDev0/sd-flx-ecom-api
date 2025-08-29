import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Roles } from '../enumerations/role.enum';
import { CommonUtilService } from '../../utils/common.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly commonUtilService: CommonUtilService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userIdHeader = request.headers['user-id'];
    if (!userIdHeader) throw new UnauthorizedException('Missing user-id header');
    const userId = Number(userIdHeader);

    const roleName = await this.commonUtilService.getUserRole(userId);
    const roleToEnum: Record<string, Roles> = {
      Admin: Roles.ADMIN,
      Vendor: Roles.VENDOR,
      User: Roles.USER,
    };
    const userRoleEnum = roleToEnum[roleName] ?? Roles.USER;
    return requiredRoles.includes(userRoleEnum);
  }
}


