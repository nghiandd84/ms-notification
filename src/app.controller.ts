import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Unicorn } from 'dn-core';
import { Public } from 'dn-api-core';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('hello')
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    const unicorn = new Unicorn();
    return this.appService.getHello() + '---' + unicorn.sayHelloTo('HAHA');
  }
}
