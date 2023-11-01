import { AutoIncrement, Column, PrimaryKey, Table, Model } from "sequelize-typescript";
import { AccountEntity } from "../entities";

@Table({ tableName: "accounts" })
export class AccountModel extends Model<AccountModel> implements AccountEntity {
    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @Column
    public fullName: string;

    @Column
    public balance: number;

    @Column
    public password: string;   
}