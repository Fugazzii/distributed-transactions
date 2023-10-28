import { Inject, Injectable } from '@nestjs/common';
import { BLACKLIST_REPOSITORY_TOKEN, IBlacklistRepository } from './lib/repositories';
import { NewBlacklisted } from './lib/dtos';
import { BlacklistResponse } from './lib/responses';

@Injectable()
export class BlacklistService {
    public constructor(
        @Inject(BLACKLIST_REPOSITORY_TOKEN) private readonly blacklistRepository: IBlacklistRepository
    ) {}

    public async createAccount(newBlacklisted: NewBlacklisted): Promise<number> {
        return this.blacklistRepository.add(newBlacklisted);
    }

    public async findAccount(id: number): Promise<BlacklistResponse> {
        return this.blacklistRepository.findOne(id);
    }
}
