import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from 'src/main/entities/user-session.entity';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSession)
    private readonly repository: Repository<UserSession>,
  ) {}

  async findActiveSession(
    userId: number,
    token: string,
  ): Promise<UserSession | null> {
    return await this.repository.findOne({
      where: { user: { id: userId }, token },
      relations: ['user'],
    });
  }

  async findUserSessionById(userId: number): Promise<UserSession | null> {
    return await this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findAllUserSession(): Promise<UserSession[] | null> {
    return await this.repository.find({});
  }

  async findUserSessionByToken(
    accessToken: string,
  ): Promise<UserSession | null> {
    return await this.repository.findOne({
      where: {
        token: accessToken,
      },
    });
  }

  async findSession(
    userId: number,
    accessToken: string,
  ): Promise<UserSession | null> {
    return await this.repository.findOne({
      where: {
        user: { id: userId },
        token: accessToken,
      },
    });
  }
  async findValidSession(
    userId: number,
    accessToken: string,
  ): Promise<UserSession | null> {
    return await this.repository.findOne({
      where: {
        user: { id: userId },
        token: accessToken,
      },
    });
  }

  create(sessionData: Partial<UserSession>): UserSession {
    return this.repository.create(sessionData);
  }

  async save(session: UserSession): Promise<UserSession> {
    return await this.repository.save(session);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repository.delete({ token });
  }

  async deletebyUserId(userId: number): Promise<void> {
    await this.repository.delete({ user: { id: userId } });
  }

  async deleteSession(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
