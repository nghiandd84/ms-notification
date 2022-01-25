import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenTelemetryModule, LoggerModule } from 'dn-api-core';
import {
  AtGuard,
  AuthModule,
  DB_CONFIG,
  RabbitMQModule as RabbitMQModule,
  RABBITMQ_CONFIG,
} from 'dn-api-core';
import { APP_ID } from 'dn-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import migrations from './migrations';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    
    hostMetrics: true,
    defaultMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

@Module({
  imports: [
    LoggerModule,
    OpenTelemetryModuleConfig,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || DB_CONFIG.DB_HOST,
        port: parseInt(process.env.DB_PORT) || DB_CONFIG.DB_PORT,
        username: process.env.DB_USER || DB_CONFIG.DB_USER,
        password: process.env.DB_PASSWORD || DB_CONFIG.DB_PASSWORD,
        database: process.env.DB_NAME || 'ms_notification',
        // entities: [UserEntity],
        synchronize: true, // REMOVE on PROD, only run when develop
        logging: false,
        // migrationsTableName: 'app_migration',
        migrations: migrations,
        // migrationsRun: true,
      }),
    }),

    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: APP_ID.NOTIFICATION,
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL || RABBITMQ_CONFIG.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
