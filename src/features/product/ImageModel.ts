import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  imageId!: string; 

  @Column()
  url!: string; 

  @CreateDateColumn()
  createdDate!: Date; 

  @CreateDateColumn()
  modifiedDate!: Date; 
}
