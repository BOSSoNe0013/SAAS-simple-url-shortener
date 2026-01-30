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
  Logger,
} from "@nestjs/common";
import { ShortUrlService } from "../services/short-url.service";
import { JwtGuard } from "../guards/jwt.guard";
import { CreateShortUrlDto } from "../dto/create-short-url.dto";
import { Request } from "express";
import { UpdateShortUrlDto } from "../dto/update-short-url.dto";
import { GetUser } from "../decorators/user.decorator";
import { User } from "../entities/user.entity";

@Controller("admin/short-urls")
@UseGuards(JwtGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly svc: ShortUrlService) {}
  @Post()
  async create(@GetUser() user: any, @Body() dto: CreateShortUrlDto) {
    return this.svc.create(user.sub, dto);
  }
  @Get()
  async findAll(@GetUser() user: any) {
    return this.svc.findAllForUser(user.sub);
  }
  @Put(":code")
  async update(@GetUser() user: any, @Param("code") code: string, @Body() dto: UpdateShortUrlDto) {
    return this.svc.update(user.sub, code, dto);
  }
  @Delete(":code")
  async delete(@GetUser() user: any, @Param("code") code: string) {
    return { success: await this.svc.delete(user.sub, code) };
  }
}
