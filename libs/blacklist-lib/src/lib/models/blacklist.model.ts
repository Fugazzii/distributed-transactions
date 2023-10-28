import { Model } from "sequelize";
import { BlacklistEntity } from "../entities";
import { AllowNull, AutoIncrement, Column, PrimaryKey } from "sequelize-typescript";

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