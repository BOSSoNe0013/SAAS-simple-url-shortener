import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { User } from './entities/user.entity';
import { Click } from './entities/click.entity';
import { ShortUrlService } from './services/short-url.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/config/services/config.service';
import { DatabaseFactory } from './factories/database.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      extraProviders: [AppConfigService],
      useClass: DatabaseFactory,
    }) as any,
    TypeOrmModule.forFeature([User, ShortUrl, Click]) as any,
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "default_key"),
        signOptions: { expiresIn: "4h" },
      }),
      inject: [ConfigService],
    }) as any,
  ],
  providers: [
    ShortUrlService, 
    AuthService,
  ],
  exports: [
    ShortUrlService, 
    AuthService
  ]
})
export class DomainModule {}
