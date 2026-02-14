import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  // Enable CORS
  const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin.split(',').map((o: string) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

  const port = configService.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application running on port ${port}`);
  logger.log(`Environment: ${configService.get('NODE_ENV') || 'development'}`);
}

bootstrap();