import { Controller, Get } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

@Controller()
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  getHello(): string {
    return this.blacklistService.getHello();
  }
}
