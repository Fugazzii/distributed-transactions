import { Body, Controller, Post } from '@nestjs/common';
import { OrchestratorService, ResponseObject } from './orchestrator.service';
import { NewTxDto } from '@app/transactions-lib';
import { AccountResponse, CreateAccountDto } from '@app/accounts-lib';

@Controller()
export class OrchestratorController {
  
  public constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post("/payment")
  public performPayment(@Body() tx: NewTxDto): Promise<ResponseObject> {
    return this.orchestratorService.performPayment(tx); 
  }

  @Post("/account")
  public async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<ResponseObject<AccountResponse>> {
    try {
      return this.orchestratorService.createAccount(createAccountDto);      
    } catch (error) {
      console.error("Failed to create account", error);
    }
  }
}