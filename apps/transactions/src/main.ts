import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Queue } from '@app/rmq';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://admin:admin@rabbitmq:5672"],
        queue: Queue.TRANSACTIONS_QUEUE,
        queueOptions: {
          durable: false
        }
      }
    }
  );
  await app.listen();
}

bootstrap();

