import { DataSource } from 'typeorm';
import { Role } from 'src/main/entities/role.entity';
import { User } from 'src/main/entities/user.entity';

export const seedRole = async (dataSource: DataSource): Promise<void> => {
  const existingRoles = await dataSource.getRepository(Role).find();
  if (existingRoles.length === 0) {
    const userRepository = dataSource.getRepository(User);
    const superUser = await userRepository.findOne({ where: {} });
    const user = await userRepository.findOne({ where: {} });

    await dataSource.getRepository(Role).save([
      {
        roleName: 'Super_user',
        roleDescription: 'super_user-role',
        createdBy: superUser,
        updatedBy: superUser,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      {
        roleName: 'User',
        roleDescription: 'user-role',
        createdBy: user,
        updatedBy: user,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    ]);
  }
};
