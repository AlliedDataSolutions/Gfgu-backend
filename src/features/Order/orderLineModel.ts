import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column()
  discountStartDate?: Date;

  @Column()
  discountEndDate?: Date;

  @Column()
  discountAmount?: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  unitPrice!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  modifiedDate!: Date;
}
