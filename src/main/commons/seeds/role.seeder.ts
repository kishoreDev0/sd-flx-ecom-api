import { DataSource } from 'typeorm';
import { Role } from 'src/main/entities/role.entity';
import { User } from 'src/main/entities/user.entity';

export const seedRole = async (dataSource: DataSource): Promise<void> => {
  const existingRoles = await dataSource.getRepository(Role).find();
  if (existingRoles.length === 0) {
    const userRepository = dataSource.getRepository(User);
    const adminUser = await userRepository.findOne({ where: {} });
    const user = await userRepository.findOne({ where: {} });

    await dataSource.getRepository(Role).save([
      {
        roleName: 'Admin',
        roleDescription: 'Administrator role with full system access',
        createdBy: adminUser,
        updatedBy: adminUser,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      {
        roleName: 'Vendor',
        roleDescription: 'Vendor role with product management capabilities',
        createdBy: adminUser,
        updatedBy: adminUser,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      {
        roleName: 'User',
        roleDescription: 'Regular user role with shopping capabilities',
        createdBy: adminUser,
        updatedBy: adminUser,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    ]);
  }
};
