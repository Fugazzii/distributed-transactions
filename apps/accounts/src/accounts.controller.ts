import { AccountResponse, AccountsService } from '@app/accounts-lib';
import { ITransaction } from '@app/common';
import { AccountEvent, AccountMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Controller, Post } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AccountsController {
  
  public constructor(
    private readonly accountsService: AccountsService
  ) {}

  @MessagePattern(AccountMessage.VERIFY)
  public async verifyAccount(@Payload() dataStr: string): Promise<ITransaction> {
    const txDetails: Omit<NewTxDto, "password"> = JSON.parse(dataStr);

    const fromAccount = await this.accountsService.findAccount(txDetails.fromAccountId);
    const toAccount = await this.accountsService.findAccount(txDetails.toAccountId);

    const accountsExist = !!fromAccount && !!toAccount;
    const hasSufficientFunds = fromAccount.balance >= txDetails.amount;

    if(!accountsExist || !hasSufficientFunds) {
      return null;
    }

    return this.accountsService.beginPaymentTransaction(txDetails);
  }

  @MessagePattern(AccountMessage.CREATE)
  public async createAccount(@Payload() createAccountDtoStr: string): Promise<AccountResponse> {
    const createAccountDto = JSON.parse(createAccountDtoStr);
    return this.accountsService.createAccount(createAccountDto);
  }

  @EventPattern(AccountEvent.COMMIT)
  public commit(t: ITransaction): Promise<void> {
    return t.commit();
  }

  @EventPattern(AccountEvent.ROLLBACK)
  public rollback(t: ITransaction): Promise<void> {
    return t.rollback();
  }
}
