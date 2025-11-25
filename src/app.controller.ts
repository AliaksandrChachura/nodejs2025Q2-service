import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly usersController: UsersController) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
