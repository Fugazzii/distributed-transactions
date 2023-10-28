import { CreateAccountDto } from "../dtos";
import { AccountEntity } from "../entities";

export const ACCOUNT_REPOSITORY_TOKEN = Symbol("ACCOUNT_REPOSITORY_TOKEN");

export interface IAccountRepository {
    create(createAccountDto: CreateAccountDto): Promise<number>;
    findOne(id: number): Promise<AccountEntity>;
}