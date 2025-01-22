import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    CategoryID!: number; // Primary Key Auto Incremented

    @Column({ type: "varchar", length: 255 })
    Type!: string; // Category type

    @Column({ type: "text" })
    Description!: string; // Category description

    @CreateDateColumn()
    createdAt!: Date; // Timestamp when the category is created

    @UpdateDateColumn()
    updatedAt!: Date; // Timestamp when the category is last updated
}
