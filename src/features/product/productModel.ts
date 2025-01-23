import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  price!: number;

  @Column()
  stockLevel!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @CreateDateColumn()
  modifeidDate!: Date;
}
