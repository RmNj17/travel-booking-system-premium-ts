import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Review } from './review.entity';

export type UserRole = 'CUSTOMER' | 'ADMIN';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text', default: 'CUSTOMER' })
  role: UserRole;

  @Column({ default: 'ACTIVE' })
  status: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
