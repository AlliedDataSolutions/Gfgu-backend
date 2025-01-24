import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AddressType } from "./addressType";
import { User } from "../user";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn()
  user!: User;

  @Column({
    type: "enum",
    nullable: true,
    enum: AddressType,
  })
  addressType?: AddressType;

  @Column({ nullable: true })
  streetName?: string;

  @Column({ nullable: true })
  town?: string;

  @Column()
  province!: string;

  @Column({ nullable: true })
  postalCode?: string;

  @CreateDateColumn()
  createdDate!: Date;

  @CreateDateColumn()
  modifiedDate!: Date;
}
