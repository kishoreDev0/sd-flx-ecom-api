import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Role } from 'src/main/entities/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async findByRoleId(roleId: number): Promise<Role> {
    return this.repository.findOne({ where: { id: roleId } });
  }

  async findByRoleName(roleName: string): Promise<Role> {
    return this.repository.findOne({ where: { roleName: roleName } });
  }

  async saveRole(role: Role): Promise<Role> {
    return this.repository.save(role);
  }
  async createRoleEntity(role: Partial<Role>): Promise<Role> {
    return this.repository.create(role);
  }

  async getAvailableRoles(): Promise<Role[]> {
    return this.repository.find({
      relations: ['createdBy', 'updatedBy'],
      select: {
        createdBy: {
          id: true,
        },
        updatedBy: {
          id: true,
        },
      },
    });
  }

  async findRoleByNameExcludingRoleId(
    roleName: string,
    roleId: number,
  ): Promise<Role | null> {
    return await this.repository.findOne({
      where: {
        roleName: roleName,
        id: Not(roleId),
      },
    });
  }
}
