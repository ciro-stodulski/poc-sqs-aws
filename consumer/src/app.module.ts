import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Transaction } from './transaction.entity';
import { SqsConsumer } from './app.consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'poc',
        entities: [Product, Transaction],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product, Transaction]),
  ],
  providers: [TransactionService, SqsConsumer],
})
export class AppModule {}
