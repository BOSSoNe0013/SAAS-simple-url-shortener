import request from "supertest";
import {
  INestApplication,
  ValidationPipe,
  Controller,
  Get,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SwaggerConfig } from "../src/swagger/swagger.module";

const appRoot = process.cwd();

// Utility to create a minimal Nest application for swagger tests
// Utility to create a minimal Nest application for swagger tests
async function createTestApp(): Promise<INestApplication> {
  @Controller()
  class TestController {
    @Get("ping")
    ping() {
      return "pong";
    }
  }

  const moduleRef = await Test.createTestingModule({
    controllers: [TestController],
  }).compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  SwaggerConfig.setup(app);
  await app.init();
  return app;
}

describe("Swagger module", () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it("GET /docs should return Swagger UI with \"Swagger UI\" field", async () => {
    const response = await request(app.getHttpServer()).get("/docs");
    expect(response.status).toBe(200);
    // Swagger UI html contains 'Swagger UI' string; we can just check presence
    expect(response.text).toContain("Swagger UI");
  });

  it("GET /docs-json should return OpenAPI spec with openapi 3.0.0", async () => {
    // Nest Swagger provides docs-json endpoint automatically
    const response = await request(app.getHttpServer()).get("/docs-json");
    expect(response.status).toBe(200);
    const body = response.body;
    expect(body).toBeDefined();
    expect(body.openapi).toBeDefined();
    expect(body.openapi).toMatch(/^3\.0/);
  });
});
