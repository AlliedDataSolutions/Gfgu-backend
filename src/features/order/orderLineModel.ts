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
import { Product } from "../product/productModel"; 
import { Vendor } from "../user/vendorModel"; 

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

  @Column({ nullable: true })
  discountStartDate?: Date;

  @Column({ nullable: true })
  discountEndDate?: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discountAmount?: number; 

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  unitPrice!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  modifiedDate!: Date;
}
