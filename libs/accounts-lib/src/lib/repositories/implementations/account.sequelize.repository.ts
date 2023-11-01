import { CreateAccountDto } from "../../dtos";
import { IAccountRepository } from "../account.repository.interface";
import { AccountModel } from "../../models";
import { Injectable } from "@nestjs/common";
import { AccountEntity } from "../../entities";
import { NewTxDto } from "@app/transactions-lib";
import { Sequelize } from "sequelize-typescript";
import { ITransaction, SequelizeTransaction } from "@app/common";
import { AccountResponse } from "../../responses";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class AccountSequelizeRepository implements IAccountRepository {
    
    public constructor(
        @InjectModel(AccountModel) private readonly repository: typeof AccountModel
    ) {}
    
    public async create(createAccountDto: CreateAccountDto): Promise<AccountResponse> {
        let obj = {
            ...createAccountDto,
            balance: 0
        };
        try {
            console.log("obj", obj);
            const rec = await this.repository.create(obj);
            console.log("record", rec);
            return rec;                
        } catch (error) {
            console.error("Error in repo", error);
            throw error;
        }
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