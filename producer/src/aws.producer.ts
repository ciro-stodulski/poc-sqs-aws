import { Injectable, OnModuleInit } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';

@Injectable()
export class SqsProducer implements OnModuleInit {
  private sqsClient: SQSClient;

  async onModuleInit() {
    this.sqsClient = new SQSClient();
  }

  async sendMessage( messageBody: string, MessageGroupId: string) {
    const command = new SendMessageCommand({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/544005205437/poc-peerbr.fifo",
      MessageBody: messageBody,
      MessageGroupId,
      MessageDeduplicationId:  randomUUID()
    });

    try {
      const response = await this.sqsClient.send(command);
      console.log('Message sent successfully', response);
    } catch (error) {
      console.error('Error sending message', error);
    }
  }
}