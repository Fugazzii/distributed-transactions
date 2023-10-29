import { NewTxDto } from "@app/transactions-lib";
import { CreateAccountDto } from "../dtos";
import { AccountEntity } from "../entities";
import { Transaction } from "sequelize";
import { ITransaction } from "@app/common";

export const ACCOUNT_REPOSITORY_TOKEN = Symbol("ACCOUNT_REPOSITORY_TOKEN");

export interface IAccountRepository {
    create(createAccountDto: CreateAccountDto): Promise<number>;
    findOne(id: number): Promise<AccountEntity>;
    beginPaymentTransaction(txDetails: Omit<NewTxDto, "password">): Promise<ITransaction>;
    commitPaymentTransaction(t: ITransaction): Promise<void>;
}