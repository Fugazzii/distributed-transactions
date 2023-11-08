import { NewTxDto } from "../dtos";
import { TransactionResponse } from "../responses";

export const TRANSACTION_REPOSITORY_TOKEN = Symbol("TRANSACTION_REPOSITORY_TOKEN");

export interface ITransactionRepository {
    create(newTx: NewTxDto): Promise<number>;
    findAll(): Promise<Array<TransactionResponse>>;
    beginNewTxTransaction(newTx: NewTxDto): Promise<string>;
    commitTransaction(txId: string): Promise<void>;
    rollbackTransaction(txId: string): Promise<void>;
}