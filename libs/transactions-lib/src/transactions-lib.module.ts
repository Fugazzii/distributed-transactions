import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TRANSACTION_REPOSITORY_TOKEN, TransactionSequelizeRepository } from './lib/repositories';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from './lib/models';

@Module({
  imports: [
    SequelizeModule.forFeature([TransactionModel])
  ],
  providers: [
    TransactionsService,
    {
      provide: TRANSACTION_REPOSITORY_TOKEN,
      useClass: TransactionSequelizeRepository
    }
  ],
  exports: [
    TransactionsService,
    TRANSACTION_REPOSITORY_TOKEN
  ]
})
export class TransactionsLibModule {}
