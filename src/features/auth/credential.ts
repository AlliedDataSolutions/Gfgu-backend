import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "../user/user";

@Entity()
export class Credential {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: ["customer", "vendor", "manager", "admin"],
    default: "customer",
  })
  role!: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: User;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
