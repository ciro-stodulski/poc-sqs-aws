import { Injectable } from '@nestjs/common';
import { SqsProducer } from './aws.producer';

@Injectable()
export class AppService {

  constructor(private readonly sqsProducer: SqsProducer) {}

  async processMessaging(dto:{type: string, productId: string, quantity: number, userId:number}): Promise<void> {
    await this.sqsProducer.sendMessage(JSON.stringify(dto), dto.type);
  }
}
