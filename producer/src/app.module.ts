import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SqsProducer } from './aws.producer';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,SqsProducer],
})
export class AppModule {}
