import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const databaseUrl = configService.get('DATABASE_URL');
const nodeEnv = configService.get('NODE_ENV') || 'development';
const isProduction = nodeEnv === 'production';

if (databaseUrl) {
  try {
    const parsed = new URL(databaseUrl);
    console.log(`✅ Using DATABASE_URL`);
    console.log(`📍 Host: ${parsed.hostname}:${parsed.port}`);
    console.log(`📍 Database: ${parsed.pathname.slice(1)}`);
  } catch {
    console.error('❌ Invalid DATABASE_URL format');
    process.exit(1);
  }
} else {
  console.log('✅ Using local DB config');
  console.log(`📍 Host: ${configService.get('DB_HOST') || 'localhost'}`);
}

const sharedConfig: Partial<DataSourceOptions> = {
  type: 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: !isProduction,
  logging: !isProduction,
};

export const typeOrmConfig: DataSourceOptions = databaseUrl
  ? {
      ...sharedConfig,
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
    }
  : {
      ...sharedConfig,
      type: 'postgres',
      host: configService.get('DB_HOST') || 'localhost',
      port: parseInt(configService.get('DB_PORT') || '5432', 10),
      username: configService.get('DB_USER') || 'postgres',
      password: configService.get('DB_PASSWORD') || '',
      database: configService.get('DB_NAME') || 'apartment_management',
    };

export default new DataSource(typeOrmConfig);