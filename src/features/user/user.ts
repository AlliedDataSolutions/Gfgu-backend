import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "../order";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  isConfirmed!: boolean;

  @Column({ nullable: true })
  phoneNumber!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @CreateDateColumn()
  modifeidDate!: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
