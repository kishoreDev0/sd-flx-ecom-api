import { DataSource } from 'typeorm';
import { User } from 'src/main/entities/user.entity';
import { Role } from 'src/main/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { Roles } from '../enumerations/role.enum';

export const seedDefault = async (dataSource: DataSource): Promise<void> => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  const superUserRole = await roleRepository.findOne({
    where: { id: Roles.SUPER_USER },
  });
  const userRole = await roleRepository.findOne({
    where: { id: Roles.USER },
  });

  if (!superUserRole) {
    throw new Error('Roles must be seeded before seeding users');
  }

  const existingUsers = await userRepository.find();
  if (existingUsers.length === 0) {
    const superUser = userRepository.create({
      firstName: 'Kishore',
      lastName: 'Kumaran',
      officialEmail: 'kishoreplaysop@gmail.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: superUserRole,
      isActive: true,
      createdBy: 1,
      updatedBy: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = userRepository.create({
      firstName: 'Pirate',
      lastName: 'pink',
      officialEmail: 'kishorednmgroup@gmail.com',
      password: await bcrypt.hash('User@123', 10),
      role: userRole,
      isActive: true,
      createdBy: 1,
      updatedBy: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    await userRepository.save([superUser, user]);
  }
};
