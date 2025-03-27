import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Vendor } from "../user/vendorModel";

@Entity()
export class VendorBalance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.id)
  vendor!: Vendor;

  @Column({ type: "decimal", default: 0.0 })
  balance!: number;

  @Column({ default: false })
  isPaid!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
