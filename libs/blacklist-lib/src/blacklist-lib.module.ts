import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlacklistModel } from './lib/models';
import { BLACKLIST_REPOSITORY_TOKEN, BlacklistSequelizeRepository } from './lib/repositories';

@Module({
  imports: [
    SequelizeModule.forFeature([BlacklistModel])
  ],
  providers: [
    {
      provide: BLACKLIST_REPOSITORY_TOKEN,
      useClass: BlacklistSequelizeRepository
    },
    BlacklistService
  ],
  exports: [
    BlacklistService
  ]
})
export class BlacklistLibModule {}
