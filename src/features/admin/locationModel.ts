import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export enum DeliveryDay {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

@Entity()
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  city!: string;

  @Column({
    type: 'enum',
    enum: DeliveryDay,
  })
  deliveryday!: DeliveryDay;

  @Column({ nullable: true })
  time!: string;
}
