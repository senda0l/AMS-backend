import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { typeOrmConfig } from '../../config/typeorm.config';
import { User } from '../../users/entities/user.entity';
import { Role, RoleType } from '../../roles/entities/role.entity';
export async function seedSuperUser(dataSource: DataSource) {
  try {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // Находим роль apartment_user
    const apartmentUserRole = await roleRepository.findOne({
      where: { type: RoleType.APARTMENT_USER },
    });

    if (!apartmentUserRole) {
      throw new Error('Role apartment_user not found. Run roles seed first.');
    }

    // Проверяем, есть ли уже суперюзер
    const existingUser = await userRepository.findOne({
      where: { email: 'superuser@example.com' },
    });

    if (existingUser) {
      console.log('Superuser already exists');
      return;
    }

    // Создаем суперпользователя
    const user = new User();
    user.firstName = 'Super';
    user.lastName = 'User';
    user.email = 'superuser@example.com';
    user.password = await bcrypt.hash('superpassword', 10); // хэшируем пароль
    user.role = apartmentUserRole;
    user.isActive = true;

    await userRepository.save(user);
    console.log('Superuser created');
  } catch (err) {
    console.error('Error seeding superuser:', err);
  }
}
  const dataSource = new DataSource(typeOrmConfig);

// Для запуска напрямую
if (require.main === module) {
  dataSource.initialize()
    .then(() => seedSuperUser(dataSource))
    .then(() => dataSource.destroy());
}
