import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Image } from "../image";
import { Category } from "./categoryModel";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToMany(() => Image, (image) => image.products)
  @JoinTable({ name: "productImages" }) // This decorator creates the join table
  images?: Image[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({name: "productCategories"})
  categories?: Category[];

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  price!: number;

  @Column()
  stockLevel!: number;

  @CreateDateColumn()
  createdDate!: Date;

  @CreateDateColumn()
  modifeidDate!: Date;
}
