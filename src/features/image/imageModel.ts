import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id!: string; 

  @ManyToMany(() => Product, (product) => product.images)
  products?: Product[];

  @Column()
  url!: string; 

  @CreateDateColumn()
  createdDate!: Date; 

  @CreateDateColumn()
  modifiedDate!: Date; 
}
