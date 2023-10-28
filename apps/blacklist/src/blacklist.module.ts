import { Module } from '@nestjs/common';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { BlacklistLibModule } from '@app/blacklist-lib';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "sqlite",
      storage: "./database/development.sqlite"
    }),
    BlacklistLibModule
  ],
  controllers: [
    BlacklistController
  ],
  providers: [
    BlacklistService
  ]
})
export class BlacklistModule {}
