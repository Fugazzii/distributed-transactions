import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsLibModule, TransactionsService } from '@app/transactions-lib';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "sqlite",
      storage: "./database/development.sqlite"
    }),
    TransactionsLibModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
