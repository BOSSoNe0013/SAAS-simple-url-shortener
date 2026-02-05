import { Module } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { AppConfigService } from "src/config/services/config.service";

@Module({ })
export class SwaggerConfig {
  static setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle("Simple URL Shortener SAAS")
      .setDescription("API documentation for Simple URL Shortener SaaS")
      .setVersion("1.0")
      .addServer("/api/v1")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const appConfig = app.get(AppConfigService);
    const options: SwaggerCustomOptions = {
      ui: appConfig.env === 'development',
      raw: appConfig.env === 'development',
    };
    SwaggerModule.setup("docs", app, document);
  }
}
