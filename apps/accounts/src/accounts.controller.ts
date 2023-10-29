import { AccountsService } from '@app/accounts-lib';
import { AccountMessage } from '@app/rmq';
import { NewTxDto } from '@app/transactions-lib';
import { Controller, Post } from '@nestjs/common';
<<<<<<< Updated upstream
=======
import { MessagePattern, Payload } from '@nestjs/microservices';
>>>>>>> Stashed changes

@Controller()
export class AccountsController {
  
  public constructor(
    private readonly accountsService: AccountsService
  ) {}

<<<<<<< Updated upstream
  @Post("/payment")
  public async payment() {
    
=======
  @MessagePattern(AccountMessage.VERIFY)
  public async verifyAccount(@Payload() dataStr: string): Promise<boolean> {
    const txDetails: Omit<NewTxDto, "password"> = JSON.parse(dataStr);

    const fromAccount = await this.accountsService.findAccount(txDetails.fromAccountId);
    const toAccount = await this.accountsService.findAccount(txDetails.toAccountId);

    const accountsExist = !!fromAccount && !!toAccount;
    const hasSufficientFunds = fromAccount.balance >= txDetails.amount;

    /** 
     * TODO: begin transaction
    */

    return accountsExist && hasSufficientFunds;
>>>>>>> Stashed changes
  }
}
