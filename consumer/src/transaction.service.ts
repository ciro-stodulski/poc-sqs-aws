import { Injectable, Logger } from '@nestjs/common';
import {  DataSource } from 'typeorm';
import { Transaction as TransactionEntity } from './transaction.entity';
import { Product } from './product.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private dataSource: DataSource,
  ) {}

  async addTransaction(productId: number, operation: string, quantity: number, userId: number): Promise<TransactionEntity> {
    return this.dataSource.transaction(async (entityManager) => {
      const product = await entityManager.findOne(Product, { where: { id: productId } });

      if (!product) {
        throw new Error('Product not found');
      }

      let status = "success"
      if (operation === 'sale') {
        product.quantity += quantity;
      } else if (operation === 'purchase') {
        if (product.quantity < quantity) {
          this.logger.error("Insufficient product quantity");

           status = "error"
        }
        product.quantity -= quantity;
      } else {
        throw new Error('Invalid operation');
      }

      if (status != "error") await entityManager.save(Product, product);

      const transaction = new TransactionEntity();
      transaction.productId = product.id;
      transaction.operation = operation;
      transaction.quantity = quantity;
      transaction.status = status
      transaction.userId = userId

      return await entityManager.save(TransactionEntity, transaction);
    });
  }
}
