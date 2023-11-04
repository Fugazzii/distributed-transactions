import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository, TRANSACTION_REPOSITORY_TOKEN } from './lib/repositories';
import { NewTxDto } from './lib/dtos';
import { TransactionResponse } from './lib/responses';
import { ITransaction } from '@app/common';

@Injectable()
export class TransactionsService {

    public constructor(
        @Inject(TRANSACTION_REPOSITORY_TOKEN) private readonly txsRepository: ITransactionRepository
    ) {}

    public async addNewTx(newTx: NewTxDto): Promise<ITransaction> {
        return this.txsRepository.beginNewTxTransaction(newTx);
    }

    public async findAll(): Promise<Array<TransactionResponse>> {
        return this.txsRepository.findAll();
    }

}
