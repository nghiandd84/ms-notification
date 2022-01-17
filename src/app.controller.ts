import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Unicorn, USER_PERMISSION } from 'dn-core';
import { AccessPermission , Public} from 'dn-api-core';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('hello')
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @UseGuards(
    AccessPermission(USER_PERMISSION.UN_ASSIGN_ROLE)
  )
  getHello(): string {
    const unicorn = new Unicorn();
    return this.appService.getHello() + '---' + unicorn.sayHelloTo('HAHA');
  }
}
