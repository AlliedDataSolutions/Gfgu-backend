import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../user/userModel";
import { OrderLine } from "./orderLineModel";
import { OrderStatus } from "./orderStatus";
import { Address } from "../address/addressModel";
import { Payment } from "../payment/paymentModel";


@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order, {
    cascade: true,
    onDelete: "CASCADE",
  })
  orderLines?: OrderLine[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;

  @CreateDateColumn()
  orderDate!: Date;

  @Column({ nullable: true })
  requiredDate!: Date;

  @Column({ nullable: true })
  shippedDate?: Date;

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
  user!: User;

  @ManyToOne(() => Address, (address) => address.id, {
    nullable: true,
    onDelete: "SET NULL",
  })
  orderAddress?: Address;

  // The PayPal order ID (returned when initialize the order)
  @Column({ nullable: true })
  paypalOrderId?: string;
}
