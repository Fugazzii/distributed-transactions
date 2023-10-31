import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountModel, AccountsLibModule, AccountsService } from '@app/accounts-lib';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        schema: configService.get<string>('DB_SCHEMA'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        host: configService.get<string>('DB_HOST'),
        dialect: configService.get('DB_DIALECT'),
        models: [typeof AccountModel],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    AccountsLibModule
  ],
  controllers: [
    AccountsController
  ],
  providers: [
    AccountsService,
  ]
})
export class AccountsModule {}
