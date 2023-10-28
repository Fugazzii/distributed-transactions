import { Repository } from "sequelize-typescript";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ITransactionRepository } from "../transaction.repository.interface";
import { TransactionModel } from "../../models";
import { NewTxDto } from "../../dtos";
import { TransactionEntity } from "../../entities";

@Injectable()
export class TransactionSequelizeRepository implements ITransactionRepository {
    
    public constructor(
        @InjectModel(TransactionModel) private readonly repository: Repository<TransactionModel>
    ) {}
    
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