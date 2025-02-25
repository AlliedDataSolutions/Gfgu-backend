import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

import { User } from "../user/userModel";
import { OrderStatus } from "./orderStatus";
import { OrderLine } from "./orderLineModel";
import { Payment } from "../payment/";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order, {
    cascade: true, // Automatically persist/remove order lines when an order is persisted/removed
  })
  orderLines?: OrderLine[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;

  @Column()
  orderDate!: Date;

  @Column({ nullable: true })
  requiredDate!: Date;

  @Column({ nullable: true })
  shippedDate?: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  totalAmount!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.pending,
  })
  status!: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user!: User; // Foreign Key referencing User
}
