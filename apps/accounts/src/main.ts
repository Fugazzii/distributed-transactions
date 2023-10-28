import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AccountsModule } from './accounts.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://rabbitmq:5672"],
        queue: 'accounts_queue',
        queueOptions: {
          durable: false
        }
      }
    }
  );
  await app.listen();
}

bootstrap();
