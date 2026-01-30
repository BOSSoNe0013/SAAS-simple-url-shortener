import {
  Controller,
  Get,
  Param,
  Res,
  Req,
  HttpStatus,
  Logger,
  HttpException,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ShortUrlService } from "../services/short-url.service";

@Controller()
export class RedirectController {
  private readonly logger = new Logger("Redirect");

  constructor(private readonly svc: ShortUrlService) {}

  @Get(":code")
  async redirect(
    @Param("code") code: string,
    @Req() req: Request,
  ) {
    const url = await this.svc.findOne(code);
    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      this.logger.warn(`Attempt to use invalid or expired code ${code}`);
      throw new HttpException('Invalid code', 404);
    }
    // rate limit per IP
    const ip = req.ip;
    if (!this.svc.isAllowed(ip)) {
      this.logger.warn(`Rate limit exceeded for IP ${ip}`);
      throw new HttpException("Too Many Requests", 429);
    }
    await this.svc.recordClick(url.id, ip);
    this.logger.log(`Target URL: ${url.targetUrl}`);
    return url.targetUrl;
  }
}
