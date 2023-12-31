import { AccountResponse, CreateAccountDto } from '@app/accounts-lib';
import { ITransaction } from '@app/common';
import { AccountEvent, AccountMessage, BlacklistMessage, Queue, TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export type ResponseObject<T = undefined> = { 
  success: boolean; 
  message: string;
  data?: T;
};

@Injectable()
export class OrchestratorService {
  
  public constructor(
    @Inject(Queue.ACCOUNTS_QUEUE) private readonly accountsQueue: ClientProxy,
    @Inject(Queue.TRANSACTIONS_QUEUE) private readonly transactionsQueue: ClientProxy,
    @Inject(Queue.BLACKLIST_QUEUE) private readonly blacklistQueue: ClientProxy,
    @Inject(Queue.ORCHESTRATOR_QUEUE) private readonly orchestratorQueue: ClientProxy
  ) {}

  public async performPayment(newTxDto: NewTxDto): Promise<ResponseObject> {
    // Destructure transaction details
    const { password, ...txDetails } = newTxDto;
    const txDetailsString = JSON.stringify(txDetails);

    // Handle the account verification
    const accountTransaction = await this.handleAccount(txDetailsString);
    if (!accountTransaction) {
        return this.failureResponse("Transaction failed due to insufficient funds");
    }

    // Destructure transaction members
    const { amount, ...txMembers } = txDetails;
    const txMembersString = JSON.stringify(txMembers);

    // Handle the blacklist verification
    const blacklistMsSuccessed = await this.handleBlacklist(txMembersString);
    if (!blacklistMsSuccessed) {
        return this.failureResponse("Transaction failed due to blacklisted member");
    }

    // Handle the transaction addition
    const txTransaction = await this.handleTxs(txDetailsString);
    if (!txTransaction) {
        // Rollback all transactions if this fails
        this.rollbackAccounts(accountTransaction);
        this.rollbackTransactions(txTransaction);
        return this.failureResponse("Failed to perform transaction");
    }

    // Commit all transactions in case of success
    this.commitAccounts(accountTransaction);
    this.commitTransactions(txTransaction);

    return this.successResponse("Successfully performed transaction");
  }

  public async createAccount(createAccountDto: CreateAccountDto): Promise<ResponseObject<AccountResponse>> {
    const accountStr = JSON.stringify(createAccountDto);
    
    await this.accountsQueue.connect();
    const response$ = this.accountsQueue.send<AccountResponse>(
      AccountMessage.CREATE,
      accountStr
    );
      
    let account: AccountResponse | null = null;
    response$.subscribe((data: AccountResponse) => {
      account = data;
    });

    return this.successResponse<AccountResponse>("Account successfully created", account);
  }

  /** 
   * Microservice handlers
   */

  private async handleAccount(txDetailsString: string): Promise<ITransaction | null> {
    const accountResponse$ = this.accountsQueue.send<ITransaction>(
        AccountMessage.VERIFY,
        txDetailsString
    );

    return await lastValueFrom(accountResponse$);
  }

  private async handleBlacklist(txMembersString: string): Promise<boolean> {
    const blacklistResponse$ = this.blacklistQueue.send<boolean>(
        BlacklistMessage.VERIFY,
        txMembersString
    );

    return await lastValueFrom(blacklistResponse$);
  }

  private async handleTxs(txDetailsString: string): Promise<ITransaction | null> {
    const transactionResponse$ = this.transactionsQueue.send<ITransaction>(
        TransactionMessage.ADD,
        txDetailsString
    );

    return await lastValueFrom(transactionResponse$);
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

  private commitAccounts(t: ITransaction) {
    return this.accountsQueue.emit<void>(AccountEvent.COMMIT, JSON.stringify(t));
  }

  private commitTransactions(t: ITransaction) {
    return this.transactionsQueue.emit<void>(TransactionEvent.COMMIT, JSON.stringify(t));
  }

  /**
   * ROLLBACKS
   */

  private async rollbackAccounts(t: ITransaction) {
    return this.accountsQueue.emit<void>(AccountEvent.ROLLBACK, JSON.stringify(t));
  }

  private rollbackTransactions(t: ITransaction) {
    return this.transactionsQueue.emit<void>(TransactionEvent.ROLLBACK, JSON.stringify(t));
  }

}