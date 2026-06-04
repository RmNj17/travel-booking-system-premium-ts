import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Booking, BookingStatus } from "../entities/booking.entity";
import { Payment } from "../entities/payment.entity";
import { TravelPackage } from "../entities/travel-package.entity";
import { Traveller } from "../entities/traveller.entity";
import { User } from "../entities/user.entity";

export type CreateBookingDto = {
  packageId: number;
  travelDate: string;
  travellers: Array<
    Pick<Traveller, "fullName" | "age" | "passportNo" | "nationality">
  >;
};

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @InjectRepository(TravelPackage)
    private readonly packages: Repository<TravelPackage>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
  ) {}

  async create(user: User, body: CreateBookingDto) {
    this.validateBooking(body);
    const travelPackage = await this.packages.findOne({
      where: { id: Number(body.packageId), status: "Active" },
    });
    if (!travelPackage)
      throw new NotFoundException("Selected travel package was not found.");
    if (travelPackage.availableSeats < body.travellers.length)
      throw new BadRequestException(
        "Not enough seats are available for this package.",
      );

    const booking = this.bookings.create({
      user,
      package: travelPackage,
      travelDate: body.travelDate,
      totalAmount: travelPackage.price * body.travellers.length,
      status: "PENDING_PAYMENT",
      createdAt: new Date().toISOString(),
      travellers: body.travellers as Traveller[],
    });
    return this.bookings.save(booking);
  }

  findMine(user: User) {
    return this.bookings.find({
      where: { user: { id: user.id } },
      order: { id: "DESC" },
    });
  }

  findAll() {
    return this.bookings.find({ order: { id: "DESC" } });
  }

  async pay(id: number, success: boolean) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException("Booking not found.");
    if (booking.status === "CONFIRMED")
      throw new BadRequestException("This booking has already been paid.");

    const payment = this.payments.create({
      booking,
      amount: booking.totalAmount,
      method: "CARD",
      status: success ? "SUCCESS" : "FAILED",
      transactionRef: `TXN-${Date.now()}`,
      paidAt: new Date().toISOString(),
    });

    booking.payment = payment;
    booking.status = success ? "PENDING_PAYMENT" : "PAYMENT_FAILED";

    if (success) {
      const travelPackage = booking.package;
      if (travelPackage.availableSeats < booking.travellers.length) {
        throw new BadRequestException(
          "Seats are no longer available for this package.",
        );
      }
      travelPackage.availableSeats = Math.max(
        0,
        travelPackage.availableSeats - booking.travellers.length,
      );
      await this.packages.save(travelPackage);
    }

    return this.bookings.save(booking);
  }

  async updateStatus(id: number, status: BookingStatus) {
    const allowed: BookingStatus[] = [
      "PENDING_PAYMENT",
      "CONFIRMED",
      "PAYMENT_FAILED",
      "CANCELLED",
      "COMPLETED",
      "REFUND_REQUESTED",
      "REFUNDED",
    ];
    if (!allowed.includes(status))
      throw new BadRequestException("Invalid booking status.");

    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException("Booking not found.");

    const allowedNextStatuses = this.getAllowedNextStatuses(booking.status);
    if (!allowedNextStatuses.includes(status)) {
      throw new BadRequestException(
        "This booking status change is not allowed from the current state.",
      );
    }

    booking.status = status === "CANCELLED" ? "REFUND_REQUESTED" : status;
    return this.bookings.save(booking);
  }

  private getAllowedNextStatuses(
    currentStatus: BookingStatus,
  ): BookingStatus[] {
    const transitions: Record<BookingStatus, BookingStatus[]> = {
      PENDING_PAYMENT: ["CONFIRMED", "PAYMENT_FAILED", "CANCELLED"],
      CONFIRMED: ["COMPLETED", "CANCELLED"],
      PAYMENT_FAILED: ["CANCELLED"],
      CANCELLED: ["CANCELLED"],
      COMPLETED: ["COMPLETED"],
      REFUND_REQUESTED: ["REFUNDED"],
      REFUNDED: ["REFUNDED"],
    };

    return transitions[currentStatus] ?? [];
  }

  private validateBooking(body: CreateBookingDto) {
    if (!body.packageId) throw new BadRequestException("Package is required.");
    if (!body.travelDate)
      throw new BadRequestException("Travel date is required.");
    if (!body.travellers?.length)
      throw new BadRequestException("At least one traveller is required.");
    for (const traveller of body.travellers) {
      if (!traveller.fullName?.trim())
        throw new BadRequestException("Traveller full name is required.");
      if (!traveller.passportNo?.trim())
        throw new BadRequestException("Passport number is required.");
      if (!traveller.nationality?.trim())
        throw new BadRequestException("Nationality is required.");
      if (Number(traveller.age) < 1)
        throw new BadRequestException("Traveller age must be valid.");
    }
  }
}
