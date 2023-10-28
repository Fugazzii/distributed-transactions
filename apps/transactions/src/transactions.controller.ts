import { TransactionsService } from '@app/transactions-lib';
import { Controller } from '@nestjs/common';

@Controller()
export class TransactionsController {
  public constructor(private readonly transactionsService: TransactionsService) {}
}
