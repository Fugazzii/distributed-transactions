import { Controller, Get, Post } from '@nestjs/common';
import { OrchestratorService, ResponseObject } from './orchestrator.service';
import { NewTxDto } from '@app/transactions-lib';

@Controller()
export class OrchestratorController {
  
  public constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post("/payment")
  public performPayment(tx: NewTxDto): Promise<ResponseObject> {
    return this.orchestratorService.performPayment(tx); 
  }
}