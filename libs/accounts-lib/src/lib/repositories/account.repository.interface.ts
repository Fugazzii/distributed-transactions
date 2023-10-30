import { NewTxDto } from "@app/transactions-lib";
import { CreateAccountDto } from "../dtos";
import { AccountEntity } from "../entities";
import { ITransaction } from "@app/common";
import { AccountResponse } from "../responses";

export const ACCOUNT_REPOSITORY_TOKEN = Symbol("ACCOUNT_REPOSITORY_TOKEN");

export interface IAccountRepository {
    create(createAccountDto: CreateAccountDto): Promise<AccountResponse>;
    findOne(id: number): Promise<AccountEntity>;
    beginPaymentTransaction(txDetails: Omit<NewTxDto, "password">): Promise<ITransaction>;
    commitPaymentTransaction(t: ITransaction): Promise<void>;
}