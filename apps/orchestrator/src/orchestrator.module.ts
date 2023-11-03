import { Module } from "@nestjs/common";
import { OrchestratorController } from "./orchestrator.controller";
import { OrchestratorService } from "./orchestrator.service";
import { Queue, RmqModule } from "@app/rmq";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule.forRoot(Queue.ORCHESTRATOR_QUEUE)
  ],
  controllers: [OrchestratorController],
  providers: [
    OrchestratorService,
    {
      provide: Queue.ACCOUNTS_QUEUE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://admin:admin@rabbitmq:5672"],
            queue: Queue.ACCOUNTS_QUEUE,
            queueOptions: {
              durable: false
            }
          }
        });
      },
    },
    {
      provide: Queue.BLACKLIST_QUEUE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://admin:admin@rabbitmq:5672"],
            queue: "Queue.BLACKLIST_QUEUE"
          }
        });
      },
    },
    {
      provide: Queue.ORCHESTRATOR_QUEUE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://admin:admin@rabbitmq:5672"],
            queue: Queue.ORCHESTRATOR_QUEUE,
            queueOptions: {
              durable: false
            }
          }
        });
      },
    },
    {
      provide: Queue.TRANSACTIONS_QUEUE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://admin:admin@rabbitmq:5672"],
            queue: Queue.TRANSACTIONS_QUEUE,
            queueOptions: {
              durable: false
            }
          }
        });
      }
    }
  ]
})
export class OrchestratorModule {}
