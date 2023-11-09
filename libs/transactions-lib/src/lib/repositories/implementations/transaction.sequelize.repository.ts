import { Repository } from "sequelize-typescript";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ITransactionRepository } from "../transaction.repository.interface";
import { TransactionModel } from "../../models";
import { NewTxDto } from "../../dtos";
import { TransactionEntity } from "../../entities";
import { ITransaction, SequelizeTransaction } from "@app/common";
import { randomUUID } from "crypto";

@Injectable()
export class TransactionSequelizeRepository implements ITransactionRepository {
    
    private readonly transactionsMap: Map<string, ITransaction>;

    public constructor(
        @InjectModel(TransactionModel) private readonly repository: Repository<TransactionModel>
    ) {
        this.transactionsMap = new Map();
    }

    public async create(newTx: NewTxDto): Promise<number> {
        const { id } = await this.repository.create({
            ...newTx,
            date: new Date()
        });

        return id;
    }
    
    public async findAll(): Promise<Array<TransactionEntity>> {
        return this.repository.findAll();
    }
    
    public async beginNewTxTransaction(newTx: NewTxDto): Promise<string> {
        const sequelize = this.repository.sequelize;
        const sequelizeT = await sequelize.transaction();
        const t = new SequelizeTransaction(sequelizeT);
    
        await this.repository.create(
            { ...newTx, date: new Date },
            { transaction: sequelizeT }
        );
        
        const uniqueId = randomUUID();

        this.transactionsMap.set(uniqueId, t);

        return uniqueId;
    }

    public commitTransaction(txId: string): Promise<void> {
        const t = this.transactionsMap.get(txId);

        if(!t) {
            throw new Error("Invalid tx in transactions");
        }

        this.transactionsMap.delete(txId);
        return t.commit();
    }

    public rollbackTransaction(txId: string): Promise<void> {
        const t = this.transactionsMap.get(txId);

        if(!t) {
            throw new Error("Invalid tx during rollback in transactions");
        }

        this.transactionsMap.delete(txId);
        return t.rollback();
    }

}