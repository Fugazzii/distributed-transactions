import { BlacklistService } from '@app/blacklist-lib';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class BlacklistController {
  
  public constructor(private readonly blacklistService: BlacklistService) {}

}
