import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { TransactionService } from './transaction.service';

@Injectable()
export class SqsConsumer implements OnModuleInit {
  private readonly logger = new Logger(SqsConsumer.name);
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(
    private transactionService: TransactionService,
  ) {
    this.sqsClient = new SQSClient();
    this.queueUrl = "https://sqs.us-east-1.amazonaws.com/544005205437/poc-peerbr.fifo";
  }

  async onModuleInit() {
    this.logger.log("Start polling queue")

    setInterval(async()=>  {
      this.logger.log("pulling of 5000")
      await this.pollQueue()
      
    }, 5000 )
   
  }

  private async pollQueue() {
    while (true) {
      try {
        const data = await this.sqsClient.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
          }),
        );

        if (data.Messages) {
          for (const message of data.Messages) {
            await this.processMessage(message);
          }
        }
      } catch (error) {
        this.logger.error('Error polling SQS queue', error);
      }
    }
  }

  private async processMessage(message: any) {
    console.log(message)
    const { productId, type, quantity, userId} = JSON.parse(message.Body);

    this.logger.log("Process type:"+ type + " of products")

    try {
      await this.transactionService.addTransaction(productId, "purchase" , quantity, userId);
      await this.deleteMessage(message.ReceiptHandle);

      this.logger.log("Process type:"+ type + " of products successfully")
    } catch (error) {
      this.logger.error('Error processing SQS message', error);
    }
  }

  private async deleteMessage(receiptHandle: string) {
    try {
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: receiptHandle,
        }),
      );
    } catch (error) {
      this.logger.error('Error deleting SQS message', error);
    }
  }
}
