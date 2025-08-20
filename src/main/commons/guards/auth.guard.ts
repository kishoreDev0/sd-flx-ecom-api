import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from 'src/main/service/auth/authentication.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
    private reflector: Reflector

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];
    const accessToken = request.headers['access-token'];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // 👈 Skip auth if route is marked public
    }

    if (!userId || !accessToken) {
      throw new UnauthorizedException(
        'Please provide a valid user ID and access token',
      );
    }

    const isValid = await this.authService.validateUser(
      Number(userId),
      accessToken,
    );

    if (!isValid) {
      throw new UnauthorizedException(
        'The provided user ID or access token is invalid',
      );
    }
    return true;
  }
}
