import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, otelSDK } from 'dn-api-core';
import { APP_PORT } from 'dn-core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

declare const module: any;

const PORT = process.env.PORT || APP_PORT.NOTIFICATION;
const ENVIRONMENT = process.env.MS_APP_ENVIRONTMENT || 'LOCAL';

async function bootstrap() {

  await otelSDK.start();

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    bufferLogs: true,
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get(Logger));

  app.enableShutdownHooks();
  app.enableCors({ origin: '*' });

  const documentBuilder = new DocumentBuilder()
    .setTitle('Notification app')
    .setDescription('Notification app description')
    .setVersion('1.0')
    .addTag('notification')
    .addBearerAuth();

  if (ENVIRONMENT !== 'LOCAL') {
    const ENDPOINT =
      process.env.MS_APP_ENDPOINT || 'http://localhost/ms-notification';
    documentBuilder.addServer(ENDPOINT);
  }

  if (ENVIRONMENT !== 'PROD') {
    const config = documentBuilder.build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.listen(PORT).then(() => {
    console.log(`App listen on PORT = ${PORT}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
