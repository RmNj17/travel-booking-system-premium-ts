import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn()
  booking: Booking;

  @Column('real')
  amount: number;

  @Column({ default: 'CARD' })
  method: string;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @Column({ nullable: true })
  transactionRef?: string;

  @Column({ nullable: true })
  paidAt?: string;
}
