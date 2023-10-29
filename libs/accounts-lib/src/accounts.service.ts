import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from './lib/repositories';
import { AccountResponse } from './lib/responses';
import { CreateAccountDto } from './lib/dtos';
import { NewTxDto } from '@app/transactions-lib';
import { ITransaction } from '@app/common';

@Injectable()
export class AccountsService {
    public constructor(
        @Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly accountRepository: IAccountRepository
    ) {}

    public async createAccount(createAccountDto: CreateAccountDto): Promise<number> {
        return this.accountRepository.create(createAccountDto);
    }

    public async findAccount(id: number): Promise<AccountResponse> {
        const accountEntity = await this.accountRepository.findOne(id);
    
        const { password, ...accountResponse } = accountEntity;

        return accountResponse;
    }

    public beginPaymentTransaction(txDetails: NewTxDto): Promise<ITransaction> {
        return this.accountRepository.beginPaymentTransaction(txDetails);
    }
}
