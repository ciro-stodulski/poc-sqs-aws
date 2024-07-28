import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'product_id' })
  productId: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  operation: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  status: string; 
  @Column()
  quantity: number;
  @Column({ name: 'user_id'})
  userId: number;

  @CreateDateColumn({ type: 'timestamp', name:"created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name:"updated_at"  })
  updatedAt: Date;
  
}
