import { Module } from '@nestjs/common';
import { TransactionsLibService } from './transactions-lib.service';

@Module({
  providers: [TransactionsLibService],
  exports: [TransactionsLibService],
})
export class TransactionsLibModule {}
