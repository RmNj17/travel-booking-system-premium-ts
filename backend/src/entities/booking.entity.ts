import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { TravelPackage } from './travel-package.entity';
import { Traveller } from './traveller.entity';
import { Payment } from './payment.entity';

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'PAYMENT_FAILED' | 'CANCELLED' | 'COMPLETED' | 'REFUND_REQUESTED' | 'REFUNDED';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => TravelPackage, (travelPackage) => travelPackage.bookings, { eager: true })
  package: TravelPackage;

  @Column()
  travelDate: string;

  @Column('real')
  totalAmount: number;

  @Column({ type: 'text', default: 'PENDING_PAYMENT' })
  status: BookingStatus;

  @Column({ default: new Date().toISOString() })
  createdAt: string;

  @OneToMany(() => Traveller, (traveller) => traveller.booking, { cascade: true, eager: true })
  travellers: Traveller[];

  @OneToOne(() => Payment, (payment) => payment.booking, { cascade: true, eager: true })
  payment?: Payment;
}
