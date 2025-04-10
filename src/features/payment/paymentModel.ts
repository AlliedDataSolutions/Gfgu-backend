import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Order } from "../order/orderModel";
import { PaymentStatus } from "./paymentStatus";
import { PaymentMethod } from "./paymentMethod";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string; 

  @Column({ unique: true })
  transactionId!: string; // Unique ID for each payment transaction

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  paymentDate!: Date;

  @Column({ enum: PaymentMethod })
  paymentMethod?: PaymentMethod;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  amount!: number;

  @Column({
    enum: PaymentStatus,
    default: PaymentStatus.pending,
  })
  status!: PaymentStatus;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  modifiedDate!: Date;

  @OneToOne(() => Order)
  @JoinColumn()
  order!: Order;
}
