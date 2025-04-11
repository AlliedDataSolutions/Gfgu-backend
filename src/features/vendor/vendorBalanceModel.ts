import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Vendor } from "../user/vendorModel";

@Entity()
export class VendorBalance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Vendor)
  @JoinColumn()
  vendor!: Vendor;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalPaid!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  pendingPayout!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
