import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', name:"created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name:"updated_at"  })
  updatedAt: Date;
  
}
