import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/main/entities/user.entity';
import { USER_RESPONSES } from '../commons/constants/response-constants/user.constant';
import { LoggerService } from '../service/logger.service';
import { GenericResponseDto } from '../dto/responses/generics/generic-response.dto';
import { UserResponseDto } from '../dto/responses/user-response.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  async findUserById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['role'],
      select: {
        role: { id: true, roleName: true },
      },
    });
  }
  async getAllUsers(): Promise<User[]> {
    return await this.repository.find({
      relations: ['role'],
      select: {
        role: { id: true, roleName: true },
      },
    });
  }

  async findUserByRoleId(roleId: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { role: { id: roleId } },
      relations: ['role'],
    });
  }

  async findUserByIdOrNotFound(
    id: number,
  ): Promise<GenericResponseDto<UserResponseDto> | GenericResponseDto<null>> {
    const existingUser = await this.repository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!existingUser) {
      this.logger.error(`User with ID '${id}' not found`);
      return USER_RESPONSES.USER_NOT_FOUND();
    }
    return USER_RESPONSES.USER_GET(existingUser as UserResponseDto);
  }

  create(userData: Partial<User>): User {
    return this.repository.create(userData);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findUserWithCredentials(userId: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id: userId },
      select: ['id', 'password', 'isActive'],
    });
  }

  async findUserByResetToken(resetToken: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { resetToken },
    });
  }

  async findUserWithFullDetails(userId: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id: userId },
      relations: ['role'],
      select: {
        role: { id: true, roleName: true },
      },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { officialEmail: email },
    });
  }

  async findByContactNumber(phone: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { primaryPhone: phone },
    });
  }
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.repository.update(userId, { password: hashedPassword });
  }
}
