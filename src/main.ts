import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { PrismaService } from './prisma/prisma.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swagger = readFileSync('doc/api.yaml', { encoding: 'utf-8' });
  const parsedSwagger = load(swagger) as OpenAPIObject;
  SwaggerModule.setup('doc', app, parsedSwagger);

  // Enable Prisma shutdown hooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(PORT);
}
bootstrap();
