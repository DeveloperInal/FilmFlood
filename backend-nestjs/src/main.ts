import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import * as CookieParser from 'cookie-parser';

async function bootstrap() { // Функция для запуска всего сервиса
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // url адрес сайта
    allowedHeaders: 'Authorization, Content-Type',
    exposedHeaders: 'Authorization',
    credentials: true // разрешение на передачу cookie файлов
  });
  app.use(bodyParser.json());
  app.use(CookieParser())
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api')
  await app.listen(4200);
}
bootstrap();
