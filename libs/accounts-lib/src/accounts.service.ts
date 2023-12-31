import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from './lib/repositories';
import { AccountResponse } from './lib/responses';
import { CreateAccountDto } from './lib/dtos';
import { NewTxDto } from '@app/transactions-lib';

@Injectable()
export class AccountsService {
    public constructor(
        @Inject(ACCOUNT_REPOSITORY_TOKEN) private readonly accountRepository: IAccountRepository
    ) {}

    public createAccount(createAccountDto: CreateAccountDto): Promise<AccountResponse> {
        return this.accountRepository.create(createAccountDto);
    }

    public async findAccount(id: number): Promise<AccountResponse> {
        const accountEntity = await this.accountRepository.findOne(id);
        
        const { password, ...accountResponse } = accountEntity;

        return accountResponse;
    }

    public beginPaymentTransaction(txDetails: Omit<NewTxDto, "password">): Promise<string> {
        return this.accountRepository.beginPaymentTransaction(txDetails);
    }

    public commitPaymentTransaction(txId: string): Promise<void> {
        return this.accountRepository.commitPaymentTransaction(txId);
    }

    public rollbackPaymentTransaction(txId: string): Promise<void> {
        return this.accountRepository.rollbackPaymentTransaction(txId);
    }
}
