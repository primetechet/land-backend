import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './common/database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: DatabaseService,
  ) {}

  @Get()
  async getHello() {
    // Return only a simple hello message, not user data
    return this.appService.getHello();
  }
}
