import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { RmqModule, RmqService } from '@app/rmq';

@Module({
  imports: [RmqModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService, RmqService],
})
export class OrchestratorModule {}
