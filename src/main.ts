import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APP_PORT } from 'dn-core'
import { AtGuard } from 'dn-api-core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

declare const module: any;

const PORT = process.env.PORT || APP_PORT.NOTIFICATION;
const ENVIRONMENT = process.env.MS_APP_ENVIRONTMENT || 'LOCAL';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  // const reflector = new Reflector();
  // const atGuard: any = new AtGuard(reflector);
  // app.useGlobalGuards(atGuard);
  const documentBuilder = new DocumentBuilder()
    .setTitle('Notification app')
    .setDescription('Notification app description')
    .setVersion('1.0')
    .addTag('notification')
    .addBearerAuth();

  if (ENVIRONMENT !== 'LOCAL') {
    const ENDPOINT = process.env.MS_APP_ENDPOINT || 'http://localhost/ms-notification';
    documentBuilder.addServer(ENDPOINT);
  }

  const config = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
