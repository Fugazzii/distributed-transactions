import { TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto, TransactionsService } from '@app/transactions-lib';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class TransactionsController {
  
  public constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(TransactionMessage.ADD)
  public addTransaction(newTxDto: NewTxDto): Promise<string> {
    return this.transactionsService.addNewTx(newTxDto);
  }

  @EventPattern(TransactionEvent.COMMIT)
  public async commit(@Payload() tStr: string): Promise<void> {
    const txId = JSON.parse(tStr);
    await this.transactionsService.commitTransaction(txId);
  }

  @EventPattern(TransactionEvent.ROLLBACK)
  public async rollback(@Payload() tStr: string): Promise<void> {
    const txId = JSON.parse(tStr);
    await this.transactionsService.rollbackTransaction(txId);
  }
}
