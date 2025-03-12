import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { Product } from "./productModel";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products?: Product[];

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ unique: true })
  type!: string;

  @Column({ type: "text" })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
