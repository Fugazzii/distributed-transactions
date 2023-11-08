import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository, TRANSACTION_REPOSITORY_TOKEN } from './lib/repositories';
import { NewTxDto } from './lib/dtos';
import { TransactionResponse } from './lib/responses';

@Injectable()
export class TransactionsService {

    public constructor(
        @Inject(TRANSACTION_REPOSITORY_TOKEN) private readonly txsRepository: ITransactionRepository
    ) {}

    public async addNewTx(newTx: NewTxDto): Promise<string> {
        return this.txsRepository.beginNewTxTransaction(newTx);
    }

    public async findAll(): Promise<Array<TransactionResponse>> {
        return this.txsRepository.findAll();
    }

    public commitTransaction(txId: string): Promise<void> {
        return this.txsRepository.commitTransaction(txId);
    }

    public rollbackTransaction(txId: string): Promise<void> {
        return this.txsRepository.commitTransaction(txId);
    }

}
