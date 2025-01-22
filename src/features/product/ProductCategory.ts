import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Product } from "./Product"; // Ensure the location of Product is correct
import { Category } from "./Category"; // Ensure the location of Category is correct

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn()
    ProductCategoryID!: number; // Primary Key Auto Incremented

    // Relationships

    @ManyToOne(() => Product)
    @JoinColumn({ name: "ProductID" })
    product!: Product; // Foreign Key from Product

    @ManyToOne(() => Category)
    @JoinColumn({ name: "CategoryID" })
    category!: Category; // Foreign Key from Category
}