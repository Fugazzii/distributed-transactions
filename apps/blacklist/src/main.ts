import { NestFactory } from '@nestjs/core';
import { BlacklistModule } from './blacklist.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Queue } from '@app/rmq';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlacklistModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://admin:admin@rabbitmq:5672"],
        queue: Queue.BLACKLIST_QUEUE,
        queueOptions: {
          durable: false
        }
      }
    }
  );
  await app.listen();
}

bootstrap();
