import { BlacklistService } from '@app/blacklist-lib';
import { BlacklistMessage } from '@app/rmq';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

type TxMembers = { fromAccountId: number; toAccountId: number; };

@Controller()
export class BlacklistController {
  
  public constructor(private readonly blacklistService: BlacklistService) {}

  @MessagePattern(BlacklistMessage.VERIFY)
  public async verifyBlacklist(@Payload() txMembersStr: string): Promise<boolean> {
    const txMembers: TxMembers = JSON.parse(txMembersStr);

    const fromAccount = await this.blacklistService.findAccount(txMembers.fromAccountId);
    const toAccount = await this.blacklistService.findAccount(txMembers.toAccountId);
    
    if(!!fromAccount || !!toAccount) {
      return false;
    }

    return true;
  }
}
