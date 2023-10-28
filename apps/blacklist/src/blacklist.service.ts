import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  getHello(): string {
    return 'Hello World!';
  }
}
