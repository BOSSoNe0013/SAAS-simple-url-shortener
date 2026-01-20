import { Controller, Get, Param, Res, Req, HttpStatus, Logger, HostParam } from '@nestjs/common';
import { Response, Request } from 'express';
import { ShortUrlService } from '../services/short-url.service';

@Controller()
export class RedirectController {
  private readonly logger = new Logger('Redirect');
  constructor(private readonly svc: ShortUrlService) {}
  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response, @Req() req: Request) {
    const url = await this.svc.findOne(code);
    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      this.logger.warn(`Attempt to use invalid or expired code ${code}`);
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    // record click
    await this.svc.update(code, { clicks: url.clicks + 1 });
    return res.redirect(url.targetUrl);
  }
}
