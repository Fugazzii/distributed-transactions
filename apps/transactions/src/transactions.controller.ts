import { ITransaction } from '@app/common';
import { TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto, TransactionsService } from '@app/transactions-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class TransactionsController {
  
  public constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(TransactionMessage.ADD)
  public addTransaction(newTxDto: NewTxDto): Promise<string> {
    return this.transactionsService.addNewTx(newTxDto);
  }

  @EventPattern(TransactionEvent.COMMIT)
  public commit(txId: string): Promise<void> {
    return this.transactionsService.commitTransaction(txId);
  }

  @EventPattern(TransactionEvent.ROLLBACK)
  public async rollback(txId: string): Promise<void> {
    // TODO:
  }
}
