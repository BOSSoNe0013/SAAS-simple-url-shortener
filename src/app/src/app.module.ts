import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { AdminController } from './domain/controllers/admin.controller';
import { RedirectController } from './domain/controllers/redirect.controller';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from './config/services/config.service';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env'
    }) as any,
    AppConfigModule,
    DomainModule,
  ],
  controllers: [
    AdminController, 
    RedirectController
  ],
  providers: [
    AppConfigService,
    JwtService,
    {
      provide: 'JWT_OPTIONS',
      useValue: { secret: process.env.JWT_SECRET },
    },
  ],
})
export class AppModule {}
