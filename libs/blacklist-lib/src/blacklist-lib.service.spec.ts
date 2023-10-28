import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistLibService } from './blacklist-lib.service';

describe('BlacklistLibService', () => {
  let service: BlacklistLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistLibService],
    }).compile();

    service = module.get<BlacklistLibService>(BlacklistLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
