import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { BookingStatus } from '../entities/booking.entity';
import { BookingsService, CreateBookingDto } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, private readonly authService: AuthService) {}

  @Post()
  async create(@Headers('authorization') auth: string, @Body() body: CreateBookingDto) {
    const user = await this.authService.findUserFromHeader(auth);
    return this.bookingsService.create(user, body);
  }

  @Get('mine')
  async mine(@Headers('authorization') auth: string) {
    const user = await this.authService.findUserFromHeader(auth);
    return this.bookingsService.findMine(user);
  }

  @Get()
  async all(@Headers('authorization') auth: string) {
    const user = await this.authService.findUserFromHeader(auth);
    this.authService.ensureRole(user, 'ADMIN');
    return this.bookingsService.findAll();
  }

  @Post(':id/pay')
  async pay(@Headers('authorization') auth: string, @Param('id') id: string, @Body() body: { success: boolean }) {
    await this.authService.findUserFromHeader(auth);
    return this.bookingsService.pay(Number(id), Boolean(body.success));
  }

  @Patch(':id/status')
  async updateStatus(@Headers('authorization') auth: string, @Param('id') id: string, @Body() body: { status: BookingStatus }) {
    const user = await this.authService.findUserFromHeader(auth);
    this.authService.ensureRole(user, 'ADMIN');
    return this.bookingsService.updateStatus(Number(id), body.status);
  }
}
