import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { ConfirmationStatus } from "./confirmationStatus";
import { User } from "../user/userModel";
import { OrderLine } from "../order";
import { Product } from "../product";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (user) => user.vendor)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Product, (product) => product.vendor)
  products?: Product[];

  @OneToMany(() => OrderLine, (orderLine) => orderLine.vendor)
  orderLines?: OrderLine[];

  @Column()
  businessName!: string;

  @Column({ nullable: true })
  businessDescription?: string;

  @Column({
    type: "enum",
    enum: ConfirmationStatus,
    default: ConfirmationStatus.pending,
  })
  status!: ConfirmationStatus;
}
