import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from 'swagger/swagger.config';
import { GlobalExceptionFilter } from './main/commons/exceptions/filters/http-exception.filter';
import { seedRole } from './main/commons/seeds/role.seeder';
import { DataSource } from 'typeorm';
import { seedDefault } from './main/commons/seeds/default.seeder';
import { join } from 'path'; // ✅ Make sure this is imported
import { NestExpressApplication } from '@nestjs/platform-express';



export async function bootstrap(): Promise<void> {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
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

  app.enableCors();

  await app.listen(process.env.PORT || 3008);
  console.log(
    `Application is running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}/api`,
  );
}

bootstrap();
