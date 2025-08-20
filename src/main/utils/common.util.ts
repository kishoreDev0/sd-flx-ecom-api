import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/main/repository/user.repository';
import { Roles } from '../commons/enumerations/role.enum';
import { User } from '../entities/user.entity';
import { LoggerService } from '../service/logger.service';

@Injectable()
export class CommonUtilService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async isUserAdmin(userId: number): Promise<boolean> {
    const user = await this.userRepository.findUserById(userId);
    return user?.role?.id === Roles.SUPER_USER;
  }

  async isUserActive(userId: number): Promise<boolean> {
    const user = await this.userRepository.findUserById(userId);
    return user?.isActive === true;
  }

  async getUser(userId: number): Promise<User> {
    return this.userRepository.findUserById(userId);
  }

  getUserIdFromRequest(req: Request): number {
    const userId = req.headers['user-id'];
    return userId ? parseInt(userId as string, 10) : 0;
  }
}
