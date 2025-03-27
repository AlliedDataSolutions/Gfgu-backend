import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @ManyToOne(() => User, (user) => user.id)
  user!: User;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.pending,
  })
  status!: OrderStatus;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  orderLines!: OrderLine[];

  @ManyToOne(() => Address, (address) => address.id, {
    nullable: true,
    onDelete: "SET NULL",
  })
  orderAddress?: Address;

  @Column({ nullable: true })
  paypalOrderId?: string;

  @OneToOne(() => Payment, (payment) => payment.order) // specify inverse side as 'order'
  payment?: Payment;
}
