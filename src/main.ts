import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { PrismaService } from './prisma/prisma.service';
import { LoggingService } from './logging/logging.service';
import {
  initializeProcessErrorHandlers,
  setProcessErrorHandlerLoggingService,
} from './helpers/process-error-handler';

const PORT = process.env.PORT || 4000;

initializeProcessErrorHandlers();

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const loggingService = app.get(LoggingService);
    setProcessErrorHandlerLoggingService(loggingService);

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

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    await app.listen(PORT);
    loggingService.log(
      `Application is running on: http://localhost:${PORT}`,
      'Bootstrap',
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] [ERROR] [Bootstrap] Failed to start application`,
      error instanceof Error
        ? `\nError: ${error.message}\nStack: ${error.stack}`
        : `\nError: ${String(error)}`,
    );
    process.exit(1);
  }
}

bootstrap();
