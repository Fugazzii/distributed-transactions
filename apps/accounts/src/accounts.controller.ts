import { Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AccountsController {
  public constructor() {}

  @MessagePattern("check_account")
  public async checkAccount() {
    
  }
}
