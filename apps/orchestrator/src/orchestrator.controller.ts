import { Body, Controller, Post } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { NewTxDto } from '@app/transactions-lib';

@Controller()
export class OrchestratorController {
  
  public constructor(
    private readonly orchestratorService: OrchestratorService
  ) {}

  @Post("/payment")
  public payment(@Body() newTxDto: NewTxDto) {
    return this.orchestratorService.performPayment(newTxDto);
  }
    
}
