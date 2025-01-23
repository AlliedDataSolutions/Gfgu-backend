import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { Order } from "../order/order";
  
  @Entity()
  export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Primary Key
  
    @Column({ unique: true })
    transactionId!: string; // Unique ID for each payment transaction
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    paymentDate!: Date; // Date and time of the payment
  
    @Column({ type: "varchar", length: 50, nullable: false })
    paymentMethod!: string; // Payment method (e.g., Credit, Debit, PayPal)
  
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    amount!: number; // Payment amount
  
    @Column({ type: "varchar", length: 20, default: "Pending" })
    status!: string; // Payment status (e.g., Confirmed, Failed)
  
    @CreateDateColumn()
    createdDate!: Date;
  
    @UpdateDateColumn()
    modifiedDate!: Date;
  
    // Relationships
    @JoinColumn({ name: "orderId" })
    order!: Order; // Foreign Key referencing the Order table
  }
  