import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountModel } from './lib/models';
import { ACCOUNT_REPOSITORY_TOKEN, AccountSequelizeRepository } from './lib/repositories';

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel])
  ],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: AccountSequelizeRepository
    },
    AccountsService
  ],
  exports: [
    AccountsService,
    ACCOUNT_REPOSITORY_TOKEN
  ]
})
export class AccountsLibModule {}
