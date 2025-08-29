import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from 'swagger/swagger.config';
import { GlobalExceptionFilter } from './main/commons/exceptions/filters/http-exception.filter';
import { seedRole } from './main/commons/seeds/role.seeder';
import { DataSource } from 'typeorm';
import { seedDefault } from './main/commons/seeds/default.seeder';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';



export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Minimal middleware for now
  app.use(helmet());
  
  // Apply request parsing with limits
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.useStaticAssets(join(process.cwd(), 'public'));
  
  const dataSource = app.get(DataSource);
  await seedRole(dataSource);
  await seedDefault(dataSource);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  setupSwagger(app, globalPrefix);

  // Configure CORS with security options
  // app.enableCors({
  //   origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8574'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  //   credentials: true,
  // });
  app.enableCors({
  origin: '*', // Allow all origins
  methods: '*', // Allow all methods
  allowedHeaders: '*', // Allow all headers
});

  await app.listen(process.env.PORT || 3008);
  console.log(
    `Application is running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}/api`,
  );
}

bootstrap();
