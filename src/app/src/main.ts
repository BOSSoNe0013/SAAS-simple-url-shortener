import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {SwaggerConfig} from './swagger/swagger.module'
import { AppConfigService } from './config/services/config.service'

async function bootstrap() {
  const logger = new Logger("Backend App");
  const app = await NestFactory.create(AppModule, { logger: new Logger("Backend App") });
  SwaggerConfig.setup(app);
  const port = app.get(AppConfigService).port;
  await app.listen(port);
  logger.log(`Backend listening on http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/docs`);
}

bootstrap();
