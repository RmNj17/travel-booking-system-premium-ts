import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreatePackageDto, PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService, private readonly authService: AuthService) {}

  @Get()
  findAll(@Query('destination') destination?: string) {
    return this.packagesService.findAll(destination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(Number(id));
  }

  @Post()
  async create(@Headers('authorization') auth: string, @Body() body: CreatePackageDto) {
    const user = await this.authService.findUserFromHeader(auth);
    this.authService.ensureRole(user, 'ADMIN');
    return this.packagesService.create(body);
  }

  @Put(':id')
  async update(@Headers('authorization') auth: string, @Param('id') id: string, @Body() body: Partial<CreatePackageDto>) {
    const user = await this.authService.findUserFromHeader(auth);
    this.authService.ensureRole(user, 'ADMIN');
    return this.packagesService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Headers('authorization') auth: string, @Param('id') id: string) {
    const user = await this.authService.findUserFromHeader(auth);
    this.authService.ensureRole(user, 'ADMIN');
    return this.packagesService.remove(Number(id));
  }
}
