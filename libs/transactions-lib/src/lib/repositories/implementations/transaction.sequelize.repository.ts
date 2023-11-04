import { Repository } from "sequelize-typescript";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ITransactionRepository } from "../transaction.repository.interface";
import { TransactionModel } from "../../models";
import { NewTxDto } from "../../dtos";
import { TransactionEntity } from "../../entities";
import { ITransaction, SequelizeTransaction } from "@app/common";

@Injectable()
export class TransactionSequelizeRepository implements ITransactionRepository {
    
    public constructor(
        @InjectModel(TransactionModel) private readonly repository: Repository<TransactionModel>
    ) {}
    
    public async beginNewTxTransaction(newTx: NewTxDto): Promise<ITransaction> {
        const sequelize = this.repository.sequelize;
        const sequelizeT = await sequelize.transaction();
        const t = new SequelizeTransaction(sequelizeT);

        await this.repository.create(
            {...newTx, date: new Date() },
            { transaction: sequelizeT } 
        );

        return t;
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

}