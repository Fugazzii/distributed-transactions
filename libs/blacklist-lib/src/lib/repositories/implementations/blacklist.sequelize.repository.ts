import { Injectable } from "@nestjs/common";
import { IBlacklistRepository } from "../blacklist.repository.interface";
import { NewBlacklisted } from "../../dtos";
import { BlacklistResponse } from "../../responses";
import { InjectModel } from "@nestjs/sequelize";
import { BlacklistModel } from "../../models";
import { Repository } from "sequelize-typescript";


@Injectable()
export class BlacklistSequelizeRepository implements IBlacklistRepository {
    
    public constructor(
        @InjectModel(BlacklistModel) private readonly repository: Repository<BlacklistModel>
    ) {}

    public async add(newBlacklisted: NewBlacklisted): Promise<number> {
        const { id } = await this.repository.create(newBlacklisted);
    
        return id;
    }
    
    public async findOne(accountId: number): Promise<BlacklistResponse> {
        return this.repository.findOne({ where: { accountId } });
    }

}