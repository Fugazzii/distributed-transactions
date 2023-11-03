import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [RmqService],
  exports: [RmqService]
})
export class RmqModule {
  public static forRoot(queue: string): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: queue,
            useFactory: () => {
              return {
                transport: Transport.RMQ,
                options: {
                  urls: ["amqp://admin:admin@rabbitmq:5672"],
                  queue,
                  queueOptions: {
                    durable: false
                  }
                }
              };
            },
          }
        ])
      ],
      exports: [ClientsModule]
    };
  }
}
