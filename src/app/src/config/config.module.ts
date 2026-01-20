import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfigService } from "./services/config.service";

@Module({
    providers: [
        ConfigService,
        AppConfigService,
    ],
    exports: [
        ConfigService,
        AppConfigService,
    ]
})
export class AppConfigModule { };