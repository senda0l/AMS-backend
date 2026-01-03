import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

// Получаем DATABASE_URL из .env (Render даёт полный URL)
const databaseUrl = configService.get('DATABASE_URL');
if (databaseUrl) {
  console.log('✅ Используется DATABASE_URL (Render)');
  console.log('📍 Хост:', databaseUrl.split('@')[1]?.split(':')[0]);
} else {
  console.log('✅ Используется локальная БД');
  console.log('📍 Хост:', configService.get('DB_HOST') || 'localhost');
}

export const typeOrmConfig: DataSourceOptions = databaseUrl
  ? {
      // Конфигурация для Render (через URL)
      type: 'postgres',
      url: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // КРИТИЧНО для Render!
      },
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: configService.get('NODE_ENV') === 'development',
      logging: configService.get('NODE_ENV') === 'development',
    }
  : {
      // Fallback для локальной БД
      type: 'postgres',
      host: configService.get('DB_HOST') || 'localhost',
      port: configService.get('DB_PORT') || 5432,
      username: configService.get('DB_USERNAME') || 'apartment_user',
      password: configService.get('DB_PASSWORD') || 'apartment_pass',
      database: configService.get('DB_DATABASE') || 'apartment_management',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: configService.get('NODE_ENV') === 'development',
      logging: configService.get('NODE_ENV') === 'development',
    };

export default new DataSource(typeOrmConfig);