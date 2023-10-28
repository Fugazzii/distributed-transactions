import { AccountEntity } from "../entities";

export interface AccountResponse extends Omit<AccountEntity, "password"> {}