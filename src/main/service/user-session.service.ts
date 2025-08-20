import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserSessionDTO } from 'src/main/dto/requests/user-session/update-user-session.dto';
import { USER_SESSION_RESPONSES } from 'src/main/commons/constants/response-constants/user-session.constant';
import { CreateUserSessionDTO } from '../dto/requests/user-session/create-user-session.dto';
import {
  UserSessionResponseWrapper,
  UserSessionsResponseWrapper,
} from 'src/main/dto/responses/user-session.response.dto';
import { UserSession } from '../entities/user-session.entity';
import { LoggerService } from './logger.service';
import { UserSessionRepository } from '../repository/user-session.repository';
@Injectable()
export class UserSessionService {
  constructor(
    private readonly userSessionRepository: UserSessionRepository,
    private readonly logger: LoggerService,
  ) {}

  async createUserSession(
    createUserSessionDto: CreateUserSessionDTO,
  ): Promise<UserSessionResponseWrapper> {
    const userSession = new UserSession();
    userSession.user = createUserSessionDto.user;
    userSession.token = createUserSessionDto.token;
    userSession.expiresAt = createUserSessionDto.expiresAt;

    const savedUserSession = await this.userSessionRepository.save(userSession);
    this.logger.log(`User session created with ID ${savedUserSession.id}`);
    return USER_SESSION_RESPONSES.USER_SESSION_CREATED(savedUserSession);
  }

  async getUserSessions(): Promise<UserSessionsResponseWrapper> {
    this.logger.log('Fetching all user sessions');
    const userSessions = await this.userSessionRepository.findAllUserSession();
    if (userSessions.length === 0) {
      this.logger.warn('No user sessions found');
      return USER_SESSION_RESPONSES.USER_SESSIONS_NOT_FOUND();
    }
    return USER_SESSION_RESPONSES.USER_SESSIONS_FETCHED(userSessions);
  }

  async getUserSessionById(token: string): Promise<UserSessionResponseWrapper> {
    this.logger.log(`Fetching user session with ID ${token}`);
    const userSession =
      await this.userSessionRepository.findUserSessionByToken(token);
    if (!userSession) {
      this.logger.warn(`User session with ID ${token} not found`);
      throw new NotFoundException(`User session with ID ${token} not found`);
    }
    return USER_SESSION_RESPONSES.USER_SESSION_FETCHED(userSession);
  }

  async updateUserSession(
    id: number,
    updateUserSessionDto: UpdateUserSessionDTO,
  ): Promise<UserSessionResponseWrapper> {
    const userSession =
      await this.userSessionRepository.findUserSessionById(id);
    if (!userSession) {
      this.logger.warn(`User session with ID ${id} not found`);
      throw new NotFoundException(`User session with ID ${id} not found`);
    }
    Object.assign(userSession, updateUserSessionDto);
    const updatedUserSession =
      await this.userSessionRepository.save(userSession);
    this.logger.log(`User session with ID ${id} updated`);
    return USER_SESSION_RESPONSES.USER_SESSION_UPDATED(updatedUserSession);
  }

  getUserSessionDetails(sessionId: string): Promise<UserSession> {
    const userSession =
      this.userSessionRepository.findUserSessionByToken(sessionId);
    if (!userSession) {
      this.logger.warn(`User session with ID ${sessionId} not found`);
      throw new NotFoundException(
        `User session with ID ${sessionId} not found`,
      );
    }
    return userSession;
  }

  async deleteUserSession(sessionId: string): Promise<object> {
    const sessionToDelete =
      await this.userSessionRepository.findUserSessionByToken(sessionId);
    if (!sessionToDelete) {
      return USER_SESSION_RESPONSES.USER_SESSION_NOT_FOUND(sessionId);
    }
    await this.userSessionRepository.deleteSession(sessionToDelete.id);

    this.logger.log(`User session with ID ${sessionToDelete.id} deleted`);
    return USER_SESSION_RESPONSES.USER_SESSION_DELETED;
  }
}
