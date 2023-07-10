import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { green, infoEmoji, isProd, sys_notification } from './config/oneliners';
import { HttpErrorFilter } from './filters/error.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'https://ekosora.vercel.app',
      'http://ekosora.vercel.app',
    ],
    credentials: true,
  });
  app.useGlobalFilters(new HttpErrorFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .addCookieAuth('jwt')
    .setTitle('eKOSORA docs')
    .setDescription('The next URUBUTO but better.')
    .setVersion('2.0')
    .addTag('auth', 'Authentication related routes')
    .addTag('student', 'Student related routes')
    .addTag('educator', 'Educator related routes')
    .addTag('parent', 'Parent related routes')
    .addTag('announcement', 'Announcement related routes')
    .addTag('settings', 'Settings related routes')
    .addTag('default', 'unclassified')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document);

  // Middleware
  app.use(urlencoded({ limit: '3mb', extended: true }));
  app.use(json({ limit: '3mb' }));

  await app.listen(process.env.PORT, () => {
    console.log(green(infoEmoji, 'Really up'));
    if (!isProd()) {
      sys_notification('nestjs', 'Server is UP');
    }
  });
}
bootstrap();
