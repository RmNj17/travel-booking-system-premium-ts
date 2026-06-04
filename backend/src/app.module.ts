import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { Booking } from "./entities/booking.entity";
import { Payment } from "./entities/payment.entity";
import { Review } from "./entities/review.entity";
import { TravelPackage } from "./entities/travel-package.entity";
import { Traveller } from "./entities/traveller.entity";
import { User } from "./entities/user.entity";
import { PackagesModule } from "./packages/packages.module";
import { SeedService } from "./entities/seed/seed.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database:
        process.env.NODE_ENV === "production"
          ? "/tmp/travel_booking.sqlite"
          : "travel_booking.sqlite",
      entities: [User, TravelPackage, Booking, Traveller, Payment, Review],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, TravelPackage]),
    AuthModule,
    PackagesModule,
    BookingsModule,
  ],
  providers: [SeedService],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {
    void this.seedService.seed();
  }
}
