import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { User } from './entities/user.entity';
import { Click } from './entities/click.entity';
import { ShortUrlService } from './services/short-url.service';
import { AuthService } from './services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../config/services/config.service';
import { DatabaseFactory } from './factories/database.factory';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      extraProviders: [AppConfigService],
      useClass: DatabaseFactory,
    }) as any,
    TypeOrmModule.forFeature([User, ShortUrl, Click]) as any,
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
    ShortUrlService, 
    AuthService,
    JwtService,
  ],
  exports: [
    ShortUrlService, 
    AuthService,
    JwtService,
  ]
})
export class DomainModule {}
