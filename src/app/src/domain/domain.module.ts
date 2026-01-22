import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../config/services/config.service';
import { DatabaseFactory } from './factories/database.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      extraProviders: [AppConfigService],
      useClass: DatabaseFactory,
    }) as any,
  ],
  providers: [
  ],
  exports: [
  ],
})
export class DomainModule {}
