import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AccountsModule } from './accounts.module';
import { Queue } from '@app/rmq';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://admin:admin@rabbitmq:5672"],
        queue: Queue.ACCOUNTS_QUEUE,
        queueOptions: {
          durable: false
        }
      }
    }
  );
  await app.listen();
}

bootstrap();
