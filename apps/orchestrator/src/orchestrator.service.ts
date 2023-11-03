import { AccountResponse, CreateAccountDto } from '@app/accounts-lib';
import { ITransaction } from '@app/common';
import { AccountEvent, AccountMessage, BlacklistMessage, Queue, TransactionEvent, TransactionMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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

    // Publish verify message to accounts ms
    const accountResponse$ = this.accountsQueue.send<ITransaction>(
      AccountMessage.VERIFY, 
      txDetailsString
    );

    let accountMsSuccessed: ITransaction = null;
    accountResponse$.subscribe((data: ITransaction | null) => {
      accountMsSuccessed = data;
    });

    if(!accountMsSuccessed) {
      //! Rollback accounts transaction if it fails
      this.rollbackAccounts(); 
      return this.failureResponse("Transaction failed due to insufficient funds");
    }

    // Destructure transaction members
    const { amount, ...txMembers } = txDetails;
    const txMembersString = JSON.stringify(txMembers);

    // Publish verify message to blacklist ms
    const blacklistResponse$ = this.blacklistQueue.send<boolean>(
      BlacklistMessage.VERIFY,
      txMembersString
    );

    let blacklistMsSuccessed = false;
    blacklistResponse$.subscribe((data: boolean) => {
      blacklistMsSuccessed = data;
    });

    if(!blacklistMsSuccessed) {
      return this.failureResponse("Transaction failed due to blacklisted member");
    }
    
    // Publish verify message to transactions ms
    const transactionResponse$ = this.transactionsQueue.send<boolean>(
      TransactionMessage.ADD,
      txDetailsString
    );

    let transactionMsSuccessed = false;
    transactionResponse$.subscribe((data: boolean) => {
      transactionMsSuccessed = data;
    })

    if(!transactionMsSuccessed) {
      //! Rollback all transactions if here fails
      this.rollbackAll();
      return this.failureResponse("Failed to perform transaction");
    }
    
    //* Commit all transactions in case of success
    this.commitAll();
    
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

  private commitAll() {
    this.commitAccounts();
    this.commitTransactions();
  }

  private commitAccounts() {
    return this.accountsQueue.emit(AccountEvent.COMMIT, "");
  }

  private commitTransactions() {
    return this.transactionsQueue.emit(TransactionEvent.COMMIT, "");
  }

  /**
   * ROLLBACKS
   */

  private rollbackAll() {
    this.rollbackAccounts();
    this.rollbackTransactions();
  }

  private rollbackAccounts() {
    return this.accountsQueue.emit(AccountEvent.ROLLBACK, "");
  }

  private rollbackTransactions() {
    return this.transactionsQueue.emit(TransactionEvent.ROLLBACK, "");
  }

  /**
   * CONNECT clients
   */
  private connectAll(clientProxies: ClientProxy[]): void {
    clientProxies.map((proxy: ClientProxy) => {
      proxy
        .connect()
        .then(() => console.log("Connected to RabbitMQ"))
        .catch(err => console.error("Failed to connect to RabbitMQ", err));
    });
  }
}