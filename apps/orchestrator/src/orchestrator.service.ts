import { AccountResponse, CreateAccountDto } from '@app/accounts-lib';
import { ITransaction } from '@app/common';
import { AccountEvent, AccountMessage, BlacklistMessage, RmqService, TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Injectable } from '@nestjs/common';

export type ResponseObject<T = undefined> = { 
  success: boolean; 
  message: string;
  data?: T;
};

@Injectable()
export class OrchestratorService {
  
  public constructor(
    private readonly rmqService: RmqService
  ) {}

  public async performPayment(newTxDto: NewTxDto): Promise<ResponseObject> {
    // Destructure transaction details
    const { password, ...txDetails } = newTxDto;
    const txDetailsString = JSON.stringify(txDetails);

    // Publish verify message to accounts ms
    const accountMsSuccessed = await this.rmqService.publishMessage<ITransaction>(
      AccountMessage.VERIFY, 
      txDetailsString
    );

    if(!accountMsSuccessed) {
      //! Rollback accounts transaction if it fails
      await this.rollbackAccounts(); 
      return this.failureResponse("Transaction failed due to insufficient funds");
    }

    // Destructure transaction members
    const { amount, ...txMembers } = txDetails;
    const txMembersString = JSON.stringify(txMembers);

    // Publish verify message to blacklist ms
    const blacklistMsSuccessed = await this.rmqService.publishMessage<boolean>(
      BlacklistMessage.VERIFY,
      txMembersString
    );

    if(!blacklistMsSuccessed) {
      return this.failureResponse("Transaction failed due to blacklisted member");
    }
    
    // Publish verify message to transactions ms
    const transactionSuccessed = await this.rmqService.publishMessage<boolean>(
      TransactionMessage.ADD,
      txDetailsString
    );

    if(!transactionSuccessed) {
      //! Rollback all transactions if here fails
      await this.rollbackAll();
      return this.failureResponse("Failed to perform transaction");
    }
    
    //* Commit all transactions in case of success
    await this.commitAll();
    
    return this.successResponse("Successfully performed transaction");
  }

  public async createAccount(createAccountDto: CreateAccountDto): Promise<ResponseObject<AccountResponse>> {
    const accountStr = JSON.stringify(createAccountDto);

    const response$ = this.rmqService.publishMessage<AccountResponse>(
      AccountMessage.CREATE,
      accountStr
    );
      
    let account: AccountResponse | null = null;
    response$.subscribe((data: AccountResponse) => {
      account = data;
    });

    console.log("account", account);

    return this.successResponse<AccountResponse>("Account successfully created", account);
  }

  /**
   * RESPONSES
   */
  
  private successResponse<T>(message: string, data?: T) {
    return { success: true, message, data };
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