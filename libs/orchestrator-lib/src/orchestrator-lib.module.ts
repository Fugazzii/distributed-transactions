import { Module } from '@nestjs/common';
import { OrchestratorLibService } from './orchestrator-lib.service';

@Module({
  providers: [OrchestratorLibService],
  exports: [OrchestratorLibService],
})
export class OrchestratorLibModule {}
