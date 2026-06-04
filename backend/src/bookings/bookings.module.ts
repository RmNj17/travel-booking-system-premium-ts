import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Booking } from '../entities/booking.entity';
import { Payment } from '../entities/payment.entity';
import { TravelPackage } from '../entities/travel-package.entity';
import { Traveller } from '../entities/traveller.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, TravelPackage, Traveller, Payment]), AuthModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
