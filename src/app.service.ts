import { Injectable } from '@nestjs/common';
import { RabbitSubscribe as RabbitSubscribe, RABBIT_EXCHANGE_TYPE, Nack } from 'dn-api-core';
import { APP_ID } from 'dn-core';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World ' + (process.env.NAME || '123');
  }

  @RabbitSubscribe({
    exchange: `${APP_ID.USER}.${RABBIT_EXCHANGE_TYPE.TOPIC}`,
    routingKey: 'user-login',
    queue: 'user-queue'
  })
  public pubSubHandler(data: any) {
    console.log(data);
  }
}
