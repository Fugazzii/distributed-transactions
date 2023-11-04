import { ITransaction } from '@app/common';
import { TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto, TransactionsService } from '@app/transactions-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class TransactionsController {
  
  public constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(TransactionMessage.ADD)
  public addTransaction(newTxDto: NewTxDto): Promise<ITransaction> {
    return this.transactionsService.addNewTx(newTxDto);
  }

  @EventPattern(TransactionEvent.COMMIT)
  public commit(t: ITransaction): Promise<void> {
    return t.commit();
  }

  @EventPattern(TransactionEvent.ROLLBACK)
  public rollback(t: ITransaction): Promise<void> {
    return t.rollback();
  }
}
