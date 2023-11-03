import { AutoIncrement, Column, PrimaryKey, Table, Model } from "sequelize-typescript";
import { TransactionEntity } from "../entities";

@Table({ tableName: "transactions" })
export class TransactionModel extends Model implements TransactionEntity {
    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @Column
    public fromAccountId: number;

    @Column
    public toAccountId: number;

    @Column
    public amount: number;

    @Column
    public date: Date;
}