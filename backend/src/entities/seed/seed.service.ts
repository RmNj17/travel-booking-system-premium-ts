import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hashPassword } from "../../common/security";
import { TravelPackage } from "../travel-package.entity";
import { User } from "../user.entity";

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(TravelPackage)
    private readonly packages: Repository<TravelPackage>,
  ) {}

  async seed() {
    const userCount = await this.users.count();
    if (userCount === 0) {
      await this.users.save([
        {
          fullName: "Demo Customer",
          email: "user@travel.com",
          passwordHash: hashPassword("password"),
          role: "CUSTOMER",
        },
        {
          fullName: "Admin User",
          email: "admin@travel.com",
          passwordHash: hashPassword("password"),
          role: "ADMIN",
        },
      ]);
    }

    const packageCount = await this.packages.count();
    if (packageCount === 0) {
      await this.packages.save([
        {
          title: "Bali Holiday Escape",
          destination: "Bali, Indonesia",
          durationDays: 5,
          price: 899,
          availableSeats: 12,
          itinerary:
            "A relaxed beach package with airport transfer, temple visit, sunset dinner and a free leisure day.",
          hotelDetails: "4-star resort with breakfast included",
          transport: "Airport pickup and local private coach",
          imageUrl:
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
        },
        {
          title: "Tokyo City Explorer",
          destination: "Tokyo, Japan",
          durationDays: 7,
          price: 1499,
          availableSeats: 8,
          itinerary:
            "Includes Shibuya, Asakusa, Mount Fuji day trip, shopping districts and guided local food tour.",
          hotelDetails: "Central hotel near major train links",
          transport: "JR pass support and guided city transfers",
          imageUrl:
            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200",
        },
        {
          title: "Queenstown Adventure",
          destination: "Queenstown, New Zealand",
          durationDays: 4,
          price: 1199,
          availableSeats: 10,
          itinerary:
            "Adventure activities, lake cruise, scenic tour and optional free-time activities.",
          hotelDetails: "Mountain-view lodge accommodation",
          transport: "Shared coach transfer and activity transport",
          imageUrl:
            "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1200",
        },
        {
          title: "Dubai Premium Stopover",
          destination: "Dubai, UAE",
          durationDays: 3,
          price: 799,
          availableSeats: 6,
          itinerary:
            "Desert safari, city tour, marina walk and optional shopping visit.",
          hotelDetails: "Business-class hotel near metro station",
          transport: "Private airport transfer and tour vehicle",
          imageUrl:
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200",
        },
      ]);
    }
  }
}
