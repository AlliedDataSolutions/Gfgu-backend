import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./productModel";
import { Image } from "../image";

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  imageId!: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: "CASCADE" })
  product!: Product;

  @ManyToOne(() => Image, { nullable: false, onDelete: "CASCADE" })
  image!: Image;

  @CreateDateColumn()
  createdDate!: Date;

  @CreateDateColumn()
  modifiedDate!: Date;
}
