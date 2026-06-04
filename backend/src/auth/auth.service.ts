import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSessionToken, hashPassword, parseSessionToken } from '../common/security';
import { User, UserRole } from '../entities/user.entity';

export type LoginDto = { email: string; password: string };
export type RegisterDto = { fullName: string; email: string; password: string };

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async register(body: RegisterDto) {
    this.validateRegister(body);
    const email = body.email.toLowerCase().trim();
    const exists = await this.users.findOne({ where: { email } });
    if (exists) throw new ConflictException('This email is already registered. Please login instead.');

    const user = await this.users.save({
      fullName: body.fullName.trim(),
      email,
      passwordHash: hashPassword(body.password),
      role: 'CUSTOMER',
    });
    return this.makeSession(user);
  }

  async login(body: LoginDto) {
    if (!body.email || !body.password) throw new BadRequestException('Email and password are required.');
    const user = await this.users.findOne({ where: { email: body.email.toLowerCase().trim() } });
    if (!user || user.passwordHash !== hashPassword(body.password)) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('Your account is not active.');
    return this.makeSession(user);
  }

  async findUserFromHeader(authHeader?: string) {
    if (!authHeader) throw new UnauthorizedException('Please login to continue.');
    const rawToken = authHeader.replace('Bearer ', '').trim();
    const parsed = parseSessionToken(rawToken);
    if (!parsed) throw new UnauthorizedException('Your session is invalid. Please login again.');
    const user = await this.users.findOne({ where: { id: parsed.userId } });
    if (!user) throw new UnauthorizedException('Your session is invalid. Please login again.');
    return user;
  }

  ensureRole(user: User, role: UserRole) {
    if (user.role !== role) throw new UnauthorizedException('You do not have permission to perform this action.');
  }

  private validateRegister(body: RegisterDto) {
    if (!body.fullName?.trim()) throw new BadRequestException('Full name is required.');
    if (!body.email?.trim()) throw new BadRequestException('Email is required.');
    if (!body.password || body.password.length < 6) throw new BadRequestException('Password must be at least 6 characters.');
  }

  private makeSession(user: User) {
    return {
      token: createSessionToken(user.id, user.role),
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    };
  }
}
