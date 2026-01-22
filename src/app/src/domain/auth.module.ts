import { Module } from "@nestjs/common";
import { AppConfigModule } from "../config/config.module";
import { AuthService } from "./services/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JWTModule } from "./jwt.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]) as any,
    JWTModule,
    AppConfigModule,

  ],
  providers: [
    AuthService,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}