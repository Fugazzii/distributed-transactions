import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable, lastValueFrom, map } from 'rxjs';

@Injectable()
export class RmqService {
    private readonly client: ClientProxy;

    public constructor() {
        this.client = ClientProxyFactory.
            create({
                transport: Transport.RMQ,
                options: {
                    urls: ["amqp://rabbitmq:5672"],
                    queue: "default_queue",
                    queueOptions: {
                        durable: false
                    }
                }
            });
        
        this.client
            .connect()
            .then(() => console.log("Connected to RabbitMQ"))
            .catch((err) => console.error("Failed to connect to RabbitMQ", err));
    }

    public async publishEvent<T = void>(topic: string, message?: string): Promise<T> {
        const responseObservable = this.client.emit<T>(topic, message);

        return lastValueFrom(
            responseObservable.pipe(
                map((data: T) => data)
            )
        );
    }

    public publishMessage<T>(topic: string, message?: string): Observable<T> {
        return this.client.send<T>(topic, message);
    }
    
}   
