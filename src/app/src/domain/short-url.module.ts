import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigModule } from "../config/config.module";
import { ShortUrl } from "./entities/short-url.entity";
import { Click } from "./entities/click.entity";
import { ShortUrlService } from "./services/short-url.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortUrl, Click]) as any,
    AppConfigModule,
  ],
  providers: [
    ShortUrlService, 
  ],
  exports: [
    ShortUrlService, 
  ]
})
export class ShortUrlModule {}