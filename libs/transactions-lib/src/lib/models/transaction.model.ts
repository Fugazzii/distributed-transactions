import { Model } from "sequelize";
import { AutoIncrement, Column, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import { TransactionEntity } from "../entities";

@Table({ tableName: "accounts" })
export class TransactionModel extends Model implements TransactionEntity {
    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @NotNull
    @Column
    public fromAccountId: number;

    @NotNull
    @Column
    public toAccountId: number;

    @NotNull
    @Column
    public amount: number;

    @NotNull
    @Column
    public date: Date;
}