import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppConfigService } from './config/services/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new Logger("Backend App") });
  const port = app.get(AppConfigService).port;
  await app.listen(port);
  Logger.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();
