import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountModel, AccountsLibModule, AccountsService } from '@app/accounts-lib';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "sqlite",
      storage: "./database/development.sqlite"
    }),
    AccountsLibModule
  ],
  controllers: [
    AccountsController
  ],
  providers: [
    AccountsService
  ]
})
export class AccountsModule {}
