export interface TransactionEntity {
    id: number;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    date: Date;
}