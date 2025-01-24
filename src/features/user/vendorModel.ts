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

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (user) => user.vendor)
  @JoinColumn()
  user!: User;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.vendor)
  orderLines?: OrderLine[];

  @Column()
  businessName!: string;

  @Column()
  businessDescription?: string;

  @Column({
    type: "enum",
    enum: ConfirmationStatus,
    default: ConfirmationStatus.pending,
  })
  status!: ConfirmationStatus;
}
