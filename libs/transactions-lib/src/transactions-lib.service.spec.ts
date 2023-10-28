import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsLibService } from './transactions-lib.service';

describe('TransactionsLibService', () => {
  let service: TransactionsLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsLibService],
    }).compile();

    service = module.get<TransactionsLibService>(TransactionsLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
