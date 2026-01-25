import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {SwaggerConfig} from './swagger/swagger.module'
import { AppConfigService } from './config/services/config.service'
import { requestLogger } from './utils/request-logger';

async function bootstrap() {
  const logger = new Logger("Backend App");
  const app = await NestFactory.create(AppModule, { logger });
  SwaggerConfig.setup(app);
  const config = app.get(AppConfigService);
  if(config.env === 'development') {
    app.use(requestLogger);
  }
  const port = config.port + 1;
  await app.listen(port);
  logger.log(`Backend listening on http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/docs`);
}

bootstrap();
