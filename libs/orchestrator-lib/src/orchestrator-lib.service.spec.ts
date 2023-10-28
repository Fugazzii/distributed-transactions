import { Test, TestingModule } from '@nestjs/testing';
import { OrchestratorLibService } from './orchestrator-lib.service';

describe('OrchestratorLibService', () => {
  let service: OrchestratorLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrchestratorLibService],
    }).compile();

    service = module.get<OrchestratorLibService>(OrchestratorLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
