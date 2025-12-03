import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as yaml from 'yamljs';
import { readFileSync } from 'fs';

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
  const parsedSwagger = yaml.parse(swagger);
  SwaggerModule.setup('doc', app, parsedSwagger);

  await app.listen(PORT);
}
bootstrap();
