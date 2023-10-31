import { NestFactory } from '@nestjs/core';
import { BlacklistModule } from './blacklist.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlacklistModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://rabbitmq:5672"],
        queue: 'default_queue',
        queueOptions: {
          durable: false
        }
      }
    }
  );
  await app.listen();
}

bootstrap();
