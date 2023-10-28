import { Repository } from "sequelize-typescript";
import { CreateAccountDto } from "../../dtos";
import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from "../account.repository.interface";
import { AccountModel } from "../../models";
import { Injectable } from "@nestjs/common";
import { AccountEntity } from "../../entities";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class AccountSequelizeRepository implements IAccountRepository {
    
    public constructor(
        @InjectModel(AccountModel) private readonly repository: Repository<AccountModel>
    ) {}
    
    public async create(createAccountDto: CreateAccountDto): Promise<number> {
        const { id } = await this.repository.create({
            ...createAccountDto,
            balance: 0
        });

        return id;
    }
    
    public async findOne(id: number): Promise<AccountEntity> {
        return this.repository.findOne({ where: { id } });
    }

}