import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('travellers')
export class Traveller {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.travellers)
  booking: Booking;

  @Column()
  fullName: string;

  @Column('integer')
  age: number;

  @Column()
  passportNo: string;

  @Column()
  nationality: string;
}
