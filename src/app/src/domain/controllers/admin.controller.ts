import { Controller, Post, Body, UseGuards, Get, Delete, Param, Req } from '@nestjs/common';
import { ShortUrlService } from '../services/short-url.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateShortUrlDto } from '../dto/create-short-url.dto';
import { Request } from 'express';

@Controller('admin/short-urls')
@UseGuards(JwtGuard)
export class AdminController {
  constructor(private readonly svc: ShortUrlService) {}
  @Post()
  async create(@Body() dto: CreateShortUrlDto, @Req() req: Request) {
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
