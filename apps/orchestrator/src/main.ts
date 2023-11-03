import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrchestratorModule);

  const ms = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://admin:admin@rabbitmq:5672"],
      queue: 'orchestrator_queue',
      queueOptions: {
        durable: false
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
