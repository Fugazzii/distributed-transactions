import { Module } from '@nestjs/common';
import { BlacklistController } from './blacklist.controller';
import { BlacklistLibModule, BlacklistService } from '@app/blacklist-lib';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue, RmqModule } from '@app/rmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        host: configService.get<string>('DB_HOST'),
        dialect: configService.get('DB_DIALECT'),
        synchronize: true,
        autoLoadModels: true
      }),
      inject: [ConfigService]
    }),
    RmqModule.forRoot(Queue.BLACKLIST_QUEUE),
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
