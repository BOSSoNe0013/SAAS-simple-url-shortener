import {
  Controller,
  Get,
  Param,
  Res,
  Req,
  HttpStatus,
  Logger,
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
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const url = await this.svc.findOne(code);
    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      this.logger.warn(`Attempt to use invalid or expired code ${code}`);
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    // rate limit per IP
    const ip = req.ip;
    if (!this.svc.isAllowed(ip)) {
      this.logger.warn(`Rate limit exceeded for IP ${ip}`);
      return res.sendStatus(HttpStatus.TOO_MANY_REQUESTS);
    }
    await this.svc.recordClick(url.id, ip);
    return res.redirect(url.targetUrl);
  }
}
