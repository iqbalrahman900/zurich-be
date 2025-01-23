import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCode: string;

  @Column({ nullable: true })
  productDescription: string;

  @Column()
  location: string;

  @Column()
  price: number;
}