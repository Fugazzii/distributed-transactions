import { Controller, Post } from '@nestjs/common';

@Controller()
export class AccountsController {
  public constructor() {}

  @Post("/payment")
  public async payment() {
    
  }
}
