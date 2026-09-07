import { Controller, Get } from '@nestjs/common';
import { UsersApiClient } from '@nest-yalc-2/skeleton-module';

@Controller('users-client')
export class UsersClientController {
  constructor(private readonly client: UsersApiClient) {}

  @Get()
  async listUsers() {
    return this.client.listUsers();
  }

  @Get('phones')
  async listPhones() {
    return this.client.listPhones();
  }
}
