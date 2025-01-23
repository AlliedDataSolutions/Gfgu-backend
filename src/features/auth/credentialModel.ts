import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/userModel";
import { Role } from "./role";

@Entity()
export class Credential {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.customer,
  })
  role!: Role;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: User;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
