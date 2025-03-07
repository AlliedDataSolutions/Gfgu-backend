import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Image } from "../image";
import { Category } from "./categoryModel";
import { OrderLine } from "../order";
import { Vendor } from "../user";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  @JoinColumn()
  vendor!: Vendor

  @ManyToMany(() => Image, (image) => image.products)
  @JoinTable({ name: "productImages" }) // This decorator creates the join table
  images?: Image[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: "productCategories" })
  categories?: Category[];

  @OneToMany(() => OrderLine, (orderLine) => orderLine.product)
  orderLines?: OrderLine[];

  @Column()
  name!: string;

  @Column({nullable: false})
  description?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column()
  stockLevel!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @CreateDateColumn()
  modifeidDate!: Date;
}
