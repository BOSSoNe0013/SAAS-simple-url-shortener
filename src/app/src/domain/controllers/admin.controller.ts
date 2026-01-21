import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Req,
  Put,
} from "@nestjs/common";
import { ShortUrlService } from "../services/short-url.service";
import { JwtGuard } from "../guards/jwt.guard";
import { CreateShortUrlDto } from "../dto/create-short-url.dto";
import { Request } from "express";
import { UpdateShortUrlDto } from "../dto/update-short-url.dto";

@Controller("admin/short-urls")
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
  @Put(":code")
  async update(@Param("code") code: string, @Body() dto: UpdateShortUrlDto) {
    return this.svc.update(code, dto);
  }
  @Delete(":code")
  async delete(@Param("code") code: string) {
    return { success: await this.svc.delete(code) };
  }
}
