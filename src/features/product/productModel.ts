import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    name!: string

    @Column()
    lastName!: string

    @Column()
    description!: string

    @Column()
    price!: number

    @Column({nullable: true})
    phoneNumber!: string

    @Column()
    stockLevel!: number

    @CreateDateColumn()
    createdDate!: Date

    @CreateDateColumn()
    modifeidDate!: Date
}