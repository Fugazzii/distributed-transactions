import { AccountResponse, AccountsService } from '@app/accounts-lib';
import { ITransaction } from '@app/common';
import { AccountEvent, AccountMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AccountsController {
  
  public constructor(
    private readonly accountsService: AccountsService
  ) {}

  @MessagePattern(AccountMessage.VERIFY)
  public async verifyAccount(@Payload() dataStr: string): Promise<string> {
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
  public async createAccount(@Payload() createAccountDtoStr: string, @Ctx() _ctx: any): Promise<AccountResponse> {
    const createAccountDto = JSON.parse(createAccountDtoStr);
    return this.accountsService.createAccount(createAccountDto);
  }

  @EventPattern(AccountEvent.COMMIT)
  public async commit(@Payload() tStr: string): Promise<void> {
    const txId: string = JSON.parse(tStr);
    await this.accountsService.commitPaymentTransaction(txId);
  }

  @EventPattern(AccountEvent.ROLLBACK)
  public async rollback(@Payload() tStr: string): Promise<void> {
    const txId = JSON.parse(tStr);
    await this.accountsService.rollbackPaymentTransaction(txId);
  }
}
