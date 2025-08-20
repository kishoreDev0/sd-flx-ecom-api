import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserSessionDTO } from 'src/main/dto/requests/user-session/update-user-session.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { AuthGuard } from '../commons/guards/auth.guard';
import { CreateUserSessionDTO } from '../dto/requests/user-session/create-user-session.dto';
import {
  UserSessionResponseWrapper,
  UserSessionsResponseWrapper,
} from '../dto/responses/user-session.response.dto';
import { UserSessionService } from '../service/user-session.service';

@ApiTags('User Session')
@Controller('v1')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @Post('user-session')
  async createUserSession(
    @Body() createUserSessionDto: CreateUserSessionDTO,
  ): Promise<UserSessionResponseWrapper> {
    return this.userSessionService.createUserSession(createUserSessionDto);
  }

  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @Get('user-sessions')
  async getUserSessions(): Promise<UserSessionsResponseWrapper> {
    return this.userSessionService.getUserSessions();
  }

  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @Get('user-session/:id')
  async getUserSessionById(
    @Param('id') id: string,
  ): Promise<UserSessionResponseWrapper> {
    return this.userSessionService.getUserSessionById(id);
  }

  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @Patch('user-session/:id')
  async updateUserSession(
    @Param('id') id: number,
    @Body() updateUserSessionDto: UpdateUserSessionDTO,
  ): Promise<UserSessionResponseWrapper> {
    return this.userSessionService.updateUserSession(id, updateUserSessionDto);
  }
  @Delete('user-session/:sessionId')
  async deleteUserSession(
    @Param('sessionId') sessionId: string,
  ): Promise<object | string> {
    try {
      return await this.userSessionService.deleteUserSession(sessionId);
    } catch (error) {
      return `failed to delete session: ${error}`;
    }
  }
}
