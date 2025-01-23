import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Zurich API')
    .setDescription('Zurich Backend API')
    .setVersion('1.0')
    .addTag('products')
    .addApiKey({ type: 'apiKey', name: 'x-user-role', in: 'header' }, 'x-user-role')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();