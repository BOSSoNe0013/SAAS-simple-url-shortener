import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Put,
} from "@nestjs/common";
import { ShortUrlService } from "../services/short-url.service";
import { JwtGuard } from "../guards/jwt.guard";
import { CreateShortUrlDto } from "../dto/create-short-url.dto";
import { UsersService } from "../services/users.service";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { UpdateShortUrlDto } from "../dto/update-short-url.dto";
import { GetUser } from "../decorators/user.decorator";

@Controller("admin/short-urls")
@UseGuards(JwtGuard)
export class AdminController {
  constructor(
    private readonly svc: ShortUrlService,
    private readonly usersSvc: UsersService,
  ) {}
  @Post()
  async create(@GetUser() user: any, @Body() dto: CreateShortUrlDto) {
    return this.svc.create(user.sub, dto);
  }
  @Get()
  async findAll(@GetUser() user: any) {
    return this.svc.findAllForUser(user.sub);
  }
  @Put(":code")
  async update(
    @GetUser() user: any,
    @Param("code") code: string,
    @Body() dto: UpdateShortUrlDto,
  ) {
    return this.svc.update(user.sub, code, dto);
  }
  @Delete(":code")
  async delete(@GetUser() user: any, @Param("code") code: string) {
    return { success: await this.svc.delete(user.sub, code) };
  }
  @Put("change-password")
  async changePassword(@GetUser() user: any, @Body() dto: ChangePasswordDto) {
    await this.usersSvc.changePassword(
      user.sub,
      dto.oldPassword,
      dto.newPassword,
    );
    return { success: true };
  }
}
