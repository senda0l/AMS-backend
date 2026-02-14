import { DataSource } from 'typeorm';
import { seedRoles } from './roles.seed';
import { seedSuperUser } from './superuser.seed';
import { typeOrmConfig } from '../../config/typeorm.config';

async function runSeeds() {
  const dataSource = new DataSource(typeOrmConfig);

  try {
    await dataSource.initialize();
    console.log('Database connected');

    await seedRoles(dataSource);
    console.log('Roles seeded');

    await seedSuperUser(dataSource);
    console.log('Superuser seeded');

    console.log('All seeds completed successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeeds();


