import { Module } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

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
    SwaggerModule.setup("docs", app, document);
  }
}
