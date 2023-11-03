import { Transport } from "@nestjs/microservices"

export type RmqOptions = {
    transport: Transport,
    options: {
        urls: Array<string>,
        queue: string,
        queueOptions: {
            durable: boolean
        }
    }
}