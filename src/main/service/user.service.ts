import { USER_RESPONSES } from 'src/main/commons/constants/response-constants/user.constant';
import { ROLE_RESPONSES } from '../commons/constants/response-constants/role.constant';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dto/requests/user/create-user.dto';
import { UpdateUserDTO } from '../dto/requests/user/update-user.dto';
import {
  UserResponseWrapper,
  UsersResponseWrapper,
} from '../dto/responses/user-response.dto';
import { UserRepository } from '../repository/user.repository';
import { RoleRepository } from '../repository/role.repository';
import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly logger: LoggerService,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<UserResponseWrapper> {
    const role = await this.roleRepository.findByRoleId(
      createUserDto.roleId.id,
    );
    if (!role) {
      return ROLE_RESPONSES.ROLE_NOT_FOUND(createUserDto.roleId.id);
    }

    const createdByUser = await this.userRepository.findUserById(
      createUserDto.createdBy.id,
    );
    if (!createdByUser) {
      return USER_RESPONSES.USER_NOT_FOUND();
    }

    const existingUser = await this.userRepository.findByEmail(
      createUserDto.officialEmail,
    );
    if (existingUser) {
      this.logger.warn(
        `User with name ${createUserDto.firstName} ${createUserDto.lastName} already exists`,
      );
      return USER_RESPONSES.USER_ALREADY_EXISTS(existingUser.id);
    }

    const user = new User();
    Object.assign(user, createUserDto);

    user.password = await bcrypt.hash(createUserDto.password, 10);

    const savedUser = await this.userRepository.save(user);

    this.logger.log(`User created with ID ${savedUser.id}`);
    return USER_RESPONSES.USER_CREATED(savedUser);
  }

   async createUserRev(createUserDto: CreateUserDTO): Promise<UserResponseWrapper> {
    const role = await this.roleRepository.findByRoleId(
      createUserDto.roleId.id,
    );
    if (!role) {
      return ROLE_RESPONSES.ROLE_NOT_FOUND(createUserDto.roleId.id);
    }

    const createdByUser = await this.userRepository.findUserById(
      createUserDto.createdBy.id,
    );
    if (!createdByUser) {
      return USER_RESPONSES.USER_NOT_FOUND();
    }

    const existingUser = await this.userRepository.findByEmail(
      createUserDto.officialEmail,
    );
    if (existingUser) {
      this.logger.warn(
        `User with name ${createUserDto.firstName} ${createUserDto.lastName} already exists`,
      );
      return USER_RESPONSES.USER_ALREADY_EXISTS(existingUser.id);
    }

    const user = new User();
    Object.assign(user, createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created with ID ${savedUser.id}`);
    return USER_RESPONSES.USER_CREATED(savedUser);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDTO,
  ): Promise<UserResponseWrapper> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      this.logger.warn(`User with ID ${userId} not found`);
      return USER_RESPONSES.USER_NOT_FOUND();
    }

    if (updateUserDto.role.id) {
      const role = await this.roleRepository.findByRoleId(
        updateUserDto.role.id,
      );
      if (!role) {
        return ROLE_RESPONSES.ROLE_NOT_FOUND(updateUserDto.role.id);
      }
    }

    if (updateUserDto.updatedBy) {
      const updatedByUser = await this.userRepository.findUserById(
        updateUserDto.updatedBy,
      );
      if (!updatedByUser) {
        return USER_RESPONSES.USER_NOT_FOUND();
      }
    }

    if (
      updateUserDto.officialEmail &&
      updateUserDto.officialEmail !== existingUser.officialEmail
    ) {
      const userWithEmail = await this.userRepository.findByEmail(
        updateUserDto.officialEmail,
      );
      if (userWithEmail && userWithEmail.id !== userId) {
        this.logger.warn(
          `Email ${updateUserDto.officialEmail} is already in use by another user`,
        );
        return USER_RESPONSES.USER_EMAIL_ALREADY_EXISTS();
      }
    }

    try {
      if (updateUserDto.password) {
        existingUser.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      Object.keys(updateUserDto).forEach((key) => {
        if (
          updateUserDto[key] !== undefined &&
          updateUserDto[key] !== null &&
          updateUserDto[key] !== '' &&
          key !== 'password'
        ) {
          existingUser[key] = updateUserDto[key];
        }
      });

      const updatedUser = await this.userRepository.save(existingUser);
      const userWithRole = await this.userRepository.findUserById(updatedUser.id); 
  
      this.logger.log(`User with ID ${userId} updated successfully`);
      return USER_RESPONSES.USER_UPDATED(userWithRole);
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }

  async getAllUsers(): Promise<UsersResponseWrapper> {
    this.logger.log('Fetching all users');
    const users = await this.userRepository.getAllUsers();
    if (users.length === 0) {
      this.logger.warn('No users found');
      return USER_RESPONSES.USERS_NOT_FOUND();
    }
    return USER_RESPONSES.USERS_FETCHED(users);
  }

  async getUserByUserId(userId: number): Promise<UserResponseWrapper> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return USER_RESPONSES.USER_NOT_FOUND();
    }

    return USER_RESPONSES.USER_FETCHED(user);
  }

  async setActiveStatus(
    id: number,
    isActive: boolean,
  ): Promise<UserResponseWrapper> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      return USER_RESPONSES.USER_NOT_FOUND();
    }

    if (user.isActive == isActive) {
      const status = isActive ? 'active' : 'inactive';
      this.logger.warn(`User with ID ${id} is already ${status}`);
      return USER_RESPONSES.USER_ALREADY_IN_STATE(id, status);
    }

    user.isActive = isActive;
    await this.userRepository.save(user);

    const action = isActive ? 'activated' : 'deactivated';
    this.logger.log(`User with ID ${id} ${action}`);
    return USER_RESPONSES.USER_STATE_CHANGED(id, action);
  }
}
