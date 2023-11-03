import { BlacklistEntity } from "../entities";
import { AllowNull, AutoIncrement, Column, PrimaryKey, Model, Table } from "sequelize-typescript";

@Table({ tableName: "blacklist" })
export class BlacklistModel extends Model implements BlacklistEntity {
    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @Column
    public accountId: number;

    @AllowNull
    @Column
    public reason: string;

    @AllowNull
    @Column
    public expiration: number;
}