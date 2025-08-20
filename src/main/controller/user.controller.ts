import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  UseGuards,
  HttpStatus,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SetActiveStatusDTO } from '../dto/requests/user/set-active.dto';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CreateUserDTO } from '../dto/requests/user/create-user.dto';
import { UpdateUserDTO } from '../dto/requests/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UserResponseWrapper,
  UsersResponseWrapper,
} from '../dto/responses/user-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { UserService } from '../service/user.service';

@ApiTags('User')
@Controller('v1')
@UseGuards(AuthGuard)
@ApiHeadersForAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<UserResponseWrapper> {
    return this.userService.createUser(createUserDto);
  }

  @Post('create')
  async createUserRev(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<UserResponseWrapper> {
    return this.userService.createUserRev(createUserDto);
  }

  @Get('users')
  async getUsers(): Promise<UsersResponseWrapper> {
    return this.userService.getAllUsers();
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: number): Promise<UserResponseWrapper> {
    return this.userService.getUserByUserId(id);
  }

  @Patch('user/:id')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update user details',
    type: UpdateUserDTO,
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<UserResponseWrapper> {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch {
      throw new HttpException(
        'An error occurred while updating the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('user/active-status/:id')
  async setActiveStatus(
    @Param('id') id: number,
    @Body() setActiveStatusDto: SetActiveStatusDTO,
  ): Promise<UserResponseWrapper> {
    return this.userService.setActiveStatus(id, setActiveStatusDto.isActive);
  }
}
