import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "../user/vendorModel";
import { TransactionStatus } from "./transactionStatus";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.transactions)
  vendor!: Vendor;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: "enum",
    nullable: false,
    enum: TransactionStatus,
  })
  type!: TransactionStatus;

  @Column({ nullable: true })
  orderLineId?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
