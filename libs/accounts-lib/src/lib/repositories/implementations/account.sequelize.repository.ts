import { CreateAccountDto } from "../../dtos";
import { IAccountRepository } from "../account.repository.interface";
import { AccountModel } from "../../models";
import { Injectable } from "@nestjs/common";
import { AccountEntity } from "../../entities";
import { NewTxDto } from "@app/transactions-lib";
import { ITransaction, SequelizeTransaction } from "@app/common";
import { AccountResponse } from "../../responses";
import { InjectModel } from "@nestjs/sequelize";
import { QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

@Injectable()
export class AccountSequelizeRepository implements IAccountRepository {
    
    private readonly transactionsMap: Map<string, ITransaction>;

    public constructor(
        @InjectModel(AccountModel) private readonly repository: typeof AccountModel
    ) {
        this.transactionsMap = new Map();
    }
    
    public async create(createAccountDto: CreateAccountDto): Promise<AccountResponse> {
        try {
            const rec = await this.repository.create({
                ...createAccountDto,
                balance: 0
            });
            return rec;                
        } catch (error) {
            console.error("Error in repo", error);
            throw error;
        }
    }
    
    public async findOne(idParam: number): Promise<AccountEntity> {
        const { id, balance, fullName, password } = await this.repository.findOne({ where: { id: idParam } });
        return { id, balance, fullName, password };
    }

    public async beginPaymentTransaction({ fromAccountId, toAccountId, amount }: Omit<NewTxDto, "password">): Promise<string> {
        const sequelize = this.repository.sequelize;
        const sequelizeT = await sequelize.transaction();
        const t = new SequelizeTransaction(sequelizeT);

        const queryFromAccount = `
            UPDATE accounts
            SET balance = balance - :amount
            WHERE id = :fromAccountId
        `;

        const queryToAccount = `
            UPDATE accounts
            SET balance = balance + :amount
            WHERE id = :toAccountId
        `;
        
        await sequelize.query(queryFromAccount, {
            replacements: { amount, fromAccountId },
            type: QueryTypes.UPDATE,
            transaction: sequelizeT,
        });

        await sequelize.query(queryToAccount, {
            replacements: { amount, toAccountId },
            type: QueryTypes.UPDATE,
            transaction: sequelizeT,
        });

        const uniqueId = randomUUID();
        this.transactionsMap.set(uniqueId, t);
        return uniqueId;
    }

    public commitPaymentTransaction(transactionId: string): Promise<void> {
        const t = this.transactionsMap.get(transactionId);

        if(!t) {
            throw new Error("Invalid tx");
        }

        return t.commit();
    }

}