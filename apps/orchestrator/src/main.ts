import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Queue } from '@app/rmq';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(OrchestratorModule);

  const configService = app.get(ConfigService);

  const ms = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>("RABBITMQ_URL")],
      queue: Queue.ORCHESTRATOR_QUEUE,
      queueOptions: {
        durable: false
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
