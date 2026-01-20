import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ShortUrlService } from '../services/short-url.service';
import { CreateShortUrlDto } from '../dto/create-short-url.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('admin/short-urls')
@UseGuards(JwtGuard)
export class AdminController {
  constructor(private readonly svc: ShortUrlService) {}
  @Post()
  async create(@Body() dto: CreateShortUrlDto) {
    return this.svc.create(dto);
  }
  @Get()
  async findAll() {
    return this.svc.findAll();
  }
  @Delete(':code')
  async delete(@Param('code') code: string) {
    return { success: await this.svc.delete(code) };
  }
}
