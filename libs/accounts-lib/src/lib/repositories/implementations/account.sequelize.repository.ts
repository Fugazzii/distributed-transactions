import { Repository } from "sequelize-typescript";
import { CreateAccountDto } from "../../dtos";
import { ACCOUNT_REPOSITORY_TOKEN, IAccountRepository } from "../account.repository.interface";
import { AccountModel } from "../../models";
import { Injectable } from "@nestjs/common";
import { AccountEntity } from "../../entities";
import { InjectModel } from "@nestjs/sequelize";
import { NewTxDto } from "@app/transactions-lib";
import { Sequelize, Transaction } from "sequelize";
import { ITransaction, SequelizeTransaction } from "@app/common";

@Injectable()
export class AccountSequelizeRepository implements IAccountRepository {
    
    public constructor(
        @InjectModel(AccountModel) private readonly repository: Repository<AccountModel>,
        private readonly sequelize: Sequelize
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

    public async beginPaymentTransaction({ fromAccountId, toAccountId, amount }: Omit<NewTxDto, "password">): Promise<ITransaction> {
        const sequelizeT = await this.sequelize.transaction();
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