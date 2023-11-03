import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({})
export class RmqModule {

  public constructor() {}

  public static forRoot(queue: string): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: queue,
            useFactory: (configService: ConfigService) => {
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get<string>("RABBITMQ_URL")],
                  queue,
                  queueOptions: {
                    durable: false
                  }
                }
              };
            },
            inject: [ConfigService]
          }
        ])
      ],
      exports: [ClientsModule]
    };
  }
}
