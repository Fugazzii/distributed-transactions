import { NewBlacklisted } from "../dtos";
import { BlacklistResponse } from "../responses";

export const BLACKLIST_REPOSITORY_TOKEN = Symbol("BLACKLIST_REPOSITORY_TOKEN");

export interface IBlacklistRepository {
    add(newBlacklisted: NewBlacklisted): Promise<number>;
    findOne(accountId: number): Promise<BlacklistResponse>;
}