import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly auth = {
    username: process.env.WEBHOOK_USERNAME,
    password: process.env.WEBHOOK_PASSWORD,
  };

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return false;
      }
      const credentials = atob(authHeader.substring(6)).split(':');
      if (
        credentials.length === 2 &&
        credentials[0] === this.auth.username &&
        credentials[1] === this.auth.password
      ) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
