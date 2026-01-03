import { DataSource } from 'typeorm';
import { seedRoles } from './roles.seed';
import { typeOrmConfig } from '../../config/typeorm.config';

async function runSeeds() {
  const dataSource = new DataSource(typeOrmConfig);

  try {
    await dataSource.initialize();
    console.log('Database connected');

    await seedRoles(dataSource);
    console.log('Seeding completed');

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeeds();


