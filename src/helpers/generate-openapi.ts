import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { dump as yamlDump } from 'js-yaml';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./openapi.json', JSON.stringify(document, null, 2), {
    encoding: 'utf-8',
  });

  writeFileSync('./openapi.yaml', yamlDump(document), {
    encoding: 'utf-8',
  });

  await app.close();
}

generateOpenApi();
