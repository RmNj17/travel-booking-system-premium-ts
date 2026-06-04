import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Review } from './review.entity';

@Entity('travel_packages')
export class TravelPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  destination: string;

  @Column('integer')
  durationDays: number;

  @Column('real')
  price: number;

  @Column('integer')
  availableSeats: number;

  @Column('text')
  itinerary: string;

  @Column({ default: 'Active' })
  status: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  hotelDetails?: string;

  @Column({ nullable: true })
  transport?: string;

  @OneToMany(() => Booking, (booking) => booking.package)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.package)
  reviews: Review[];
}
