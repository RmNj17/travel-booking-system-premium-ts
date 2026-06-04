import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TravelPackage } from '../entities/travel-package.entity';

export type CreatePackageDto = {
  title: string;
  destination: string;
  durationDays: number;
  price: number;
  availableSeats: number;
  itinerary: string;
  imageUrl?: string;
  hotelDetails?: string;
  transport?: string;
};

@Injectable()
export class PackagesService {
  constructor(@InjectRepository(TravelPackage) private readonly packages: Repository<TravelPackage>) {}

  findAll(destination?: string) {
    const where = destination?.trim()
      ? { destination: Like(`%${destination.trim()}%`), status: 'Active' }
      : { status: 'Active' };
    return this.packages.find({ where, order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.packages.findOne({ where: { id } });
    if (!item || item.status !== 'Active') throw new NotFoundException('Travel package not found.');
    return item;
  }

  create(body: CreatePackageDto) {
    this.validatePackage(body);
    return this.packages.save({ ...body, status: 'Active' });
  }

  async update(id: number, body: Partial<CreatePackageDto>) {
    await this.findOne(id);
    await this.packages.update(id, body);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.packages.update(id, { status: 'Inactive' });
    return { message: 'Package removed successfully.' };
  }

  private validatePackage(body: CreatePackageDto) {
    if (!body.title?.trim()) throw new BadRequestException('Package title is required.');
    if (!body.destination?.trim()) throw new BadRequestException('Destination is required.');
    if (!body.itinerary?.trim()) throw new BadRequestException('Itinerary is required.');
    if (Number(body.durationDays) < 1) throw new BadRequestException('Duration must be at least 1 day.');
    if (Number(body.price) <= 0) throw new BadRequestException('Price must be greater than 0.');
    if (Number(body.availableSeats) < 0) throw new BadRequestException('Available seats cannot be negative.');
  }
}
