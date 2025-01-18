import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column({unique: true})
    email!: string

    @Column({default: false})
    isConfirmed!: boolean

    @Column({nullable: true})
    phoneNumner?: string

    @CreateDateColumn()
    createdDate!: Date

    @CreateDateColumn()
    modifeidDate!: Date
}