import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { AdminController } from './domain/controllers/admin.controller';
import { RedirectController } from './domain/controllers/redirect.controller';
import { AppConfigService } from './config/services/config.service';
import { AppConfigModule } from './config/config.module';
import { AuthController } from './domain/controllers/auth.controller';
import { UsersModule } from './domain/users.module';
import { JWTModule } from './domain/jwt.module';
import { AuthModule } from './domain/auth.module';
import { ShortUrlModule } from './domain/short-url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env'
    }) as any,
    AppConfigModule,
    DomainModule,
    JWTModule,
    UsersModule,
    AuthModule,
    ShortUrlModule
  ],
  controllers: [
    AdminController, 
    RedirectController,
    AuthController,
  ],
  providers: [
    AppConfigService,
  ],
  exports: [
  ]
})
export class AppModule {}
