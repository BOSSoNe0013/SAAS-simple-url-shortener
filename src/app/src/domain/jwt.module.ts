import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AppConfigModule } from "../config/config.module";
import { AppConfigService } from "../config/services/config.service";

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: "4h" },
      }),
      inject: [AppConfigService],
    }) as any,

  ],
  providers: [
    JwtService,

  ],
  exports: [
    JwtService,
    
  ]
})
export class JWTModule {}