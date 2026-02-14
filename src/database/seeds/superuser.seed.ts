import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { typeOrmConfig } from '../../config/typeorm.config';
import { User } from '../../users/entities/user.entity';
import { Role, RoleType } from '../../roles/entities/role.entity';

export async function seedSuperUser(dataSource: DataSource) {
  try {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const adminRole = await roleRepository.findOne({
      where: { type: RoleType.ADMIN },
    });

    if (!adminRole) {
      throw new Error('Admin role not found. Run roles seed first.');
    }

    const existingUser = await userRepository.findOne({
      where: { email: 'superuser@example.com' },
    });

    if (existingUser) {
      console.log('Superuser already exists');
      return;
    }

    const user = new User();
    user.firstName = 'Super';
    user.lastName = 'User';
    user.email = 'superuser@example.com';
    user.password = await bcrypt.hash('superpassword', 10);
    user.role = adminRole;
    user.isActive = true;

    await userRepository.save(user);
    console.log('Superuser created with admin role');
  } catch (err) {
    console.error('Error seeding superuser:', err);
  }
}

const dataSource = new DataSource(typeOrmConfig);

if (require.main === module) {
  dataSource
    .initialize()
    .then(() => seedSuperUser(dataSource))
    .then(() => dataSource.destroy())
    .catch((err) => {
      console.error('Failed to seed superuser:', err);
      process.exit(1);
    });
}
