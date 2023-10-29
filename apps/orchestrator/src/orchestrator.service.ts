import { AccountEvent, AccountMessage, BlacklistMessage, RmqService, TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Injectable } from '@nestjs/common';

export type ResponseObject = { 
  success: boolean; 
  message: string;
};

@Injectable()
export class OrchestratorService {
  
  public constructor(
    private readonly rmqService: RmqService
  ) {}

  public async performPayment(newTxDto: NewTxDto): Promise<ResponseObject> {
    const { password, ...txDetails } = newTxDto;

    const txDetailsString = JSON.stringify(txDetails);

    const accountMsSuccessed = await this.rmqService.publishMessage<boolean>(
      AccountMessage.VERIFY, 
      txDetailsString
    );

    if(!accountMsSuccessed) {
      await this.rollbackAccounts(); 
      return this.failureResponse("Transaction failed due to insufficient funds");
    }
    
    const { amount, ...txMembers } = txDetails;
    const txMembersString = JSON.stringify(txMembers);
    const blacklistMsSuccessed = await this.rmqService.publishMessage<boolean>(
      BlacklistMessage.VERIFY,
      txMembersString
    );

    if(!blacklistMsSuccessed) {
      return this.failureResponse("Transaction failed due to blacklisted member");
    }
    
    const transactionSuccessed = await this.rmqService.publishMessage<boolean>(
      TransactionMessage.ADD,
      txDetailsString
    );

    if(!transactionSuccessed) {
      await this.rollbackAll();
      return this.failureResponse("Failed to perform transaction");
    }
    
    await this.commitAll();
    
    return this.successResponse("Successfully performed transaction");
  }

  /**
   * RESPONSES
   */
  
  private successResponse(message: string) {
    return { success: true, message };
  }

  private failureResponse(message: string) {
    return { success: false, message };
  }

  /**
   * COMMITS
   */

  private async commitAll() {
    await this.commitAccounts();
    await this.commitTransactions();
  }

  private commitAccounts() {
    return this.rmqService.publishEvent(AccountEvent.COMMIT);
  }

  private commitTransactions() {
    return this.rmqService.publishEvent(TransactionEvent.COMMIT);
  }

  /**
   * ROLLBACKS
   */

  private async rollbackAll() {
    await this.rollbackAccounts();
    await this.rollbackTransactions();
  }

  private rollbackAccounts() {
    return this.rmqService.publishEvent(AccountEvent.ROLLBACK);
  }

  private rollbackTransactions() {
    return this.rmqService.publishEvent(TransactionEvent.ROLLBACK);
  }
}
