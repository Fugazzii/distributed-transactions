import { Repository } from "sequelize-typescript";
import { CreateAccountDto } from "../../dtos";
import { IAccountRepository } from "../account.repository.interface";
import { AccountModel } from "../../models";
import { Injectable } from "@nestjs/common";
import { AccountEntity } from "../../entities";
import { InjectModel } from "@nestjs/sequelize";
import { NewTxDto } from "@app/transactions-lib";
import { Sequelize } from "sequelize";
import { ITransaction, SequelizeTransaction } from "@app/common";
import { AccountResponse } from "../../responses";

@Injectable()
export class AccountSequelizeRepository implements IAccountRepository {
    
    public constructor(
        @InjectModel(AccountModel) private readonly repository: Repository<AccountModel>
    ) {}
    
    public async create(createAccountDto: CreateAccountDto): Promise<AccountResponse> {
        return this.repository.create({
            ...createAccountDto,
            balance: 0
        });
    }
    
    public async findOne(id: number): Promise<AccountEntity> {
        return this.repository.findOne({ where: { id } });
    }

    public async beginPaymentTransaction({ fromAccountId, toAccountId, amount }: Omit<NewTxDto, "password">): Promise<ITransaction> {
        const sequelize = this.repository.sequelize;
        const sequelizeT = await sequelize.transaction();
        const t = new SequelizeTransaction(sequelizeT);

        await this.repository.update(
            { balance: Sequelize.literal(`balance - ${amount}`) },
            { where: { id: fromAccountId }, transaction: sequelizeT }
        );
    
        await this.repository.update(
            { balance: Sequelize.literal(`balance + ${amount}`) },
            { where: { id: toAccountId }, transaction: sequelizeT }
        );

        return t;
    }

    public commitPaymentTransaction(t: ITransaction): Promise<void> {
        return t.commit();
    }

}