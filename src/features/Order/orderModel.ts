import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { User } from "../user/userModel";
import { OrderStatus } from "./orderStatus";
// import { OrderLine } from "./OrderLine";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

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
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user!: User; // Foreign Key referencing User

  // @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  // orderLines!: OrderLine[];
}
