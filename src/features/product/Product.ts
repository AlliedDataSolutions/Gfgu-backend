import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from "typeorm"; 
import { Vendor } from "../vendor/Vendor"; // Ensure the location of Vendor is correct

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    ProductID!: number; // Primary Key Auto Incremented.

    @Column({ type: "varchar", length: 255 })
    ProductName!: string; //Product Name

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    ProductDate!: Date; // Date and time of product creation. 

    @Column({ type: "varchar", length: 255 })
    ProductDesc!: string; //Product Description -> May need to revise Length

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    price!: number; //Product Price

    @Column({ type: "int", nullable: false })
    stockLevel!: number; // Stock level of the item

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    //Relationships
    
    @ManyToOne(() => Vendor)
    @JoinColumn({ name: "VendorID" })
    vendor!: Vendor; // Foreign Key from Vendor
}