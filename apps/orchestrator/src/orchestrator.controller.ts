import { Controller, Get, Post } from '@nestjs/common';
import { OrchestratorService, ResponseObject } from './orchestrator.service';
import { NewTxDto } from '@app/transactions-lib';
import { AccountEntity, AccountResponse, CreateAccountDto } from '@app/accounts-lib';

@Controller()
export class OrchestratorController {
  
  public constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post("/payment")
  public performPayment(tx: NewTxDto): Promise<ResponseObject> {
    return this.orchestratorService.performPayment(tx); 
  }

  @Post("/account")
  public async createAccount(createAccountDto: CreateAccountDto): Promise<ResponseObject<AccountResponse>> {
    return this.orchestratorService.createAccount(createAccountDto);
  }
}