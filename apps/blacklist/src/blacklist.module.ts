import { Module } from '@nestjs/common';
import { BlacklistController } from './blacklist.controller';
import { BlacklistLibModule, BlacklistService } from '@app/blacklist-lib';
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
        models: [],
        synchronize: true
      }),
      inject: [ConfigService]
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
