import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "../order/orderModel";
import { Vendor } from "./vendorModel";
import { Address } from "../address/addressModel";

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

  @OneToMany(() => Address, (address) => address.user)
  addresses?: Address[];

  @OneToOne(() => Vendor, (vendor) => vendor.user)
  vendor?: Vendor;
}
