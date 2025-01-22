import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { User } from "../user/user";
// import { OrderLine } from "./OrderLine";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Primary Key

  @Column()
  orderDate!: Date;

  @Column({ nullable: true })
  requiredDate!: Date;

  @Column({ nullable: true })
  shippedDate!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  totalAmount!: number;

  @Column({ default: "Pending" })
  status!: string; // Pending, Confirmed, etc.

 // @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
 // user!: User; // Foreign Key referencing User

 // @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
 // orderLines!: OrderLine[];
}
