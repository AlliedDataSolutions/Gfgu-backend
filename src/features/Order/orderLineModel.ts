import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./orderModel";
import { Product } from "../product";
import { Vendor } from "../user";

@Entity("orderLine")
export class OrderLine {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.orderLines, { onDelete: "CASCADE" })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderLines)
  product!: Product;

  @ManyToOne(() => Vendor, (vendor) => vendor.orderLines)
  @JoinColumn()
  vendor!: Vendor;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  modifiedDate!: Date;
}
