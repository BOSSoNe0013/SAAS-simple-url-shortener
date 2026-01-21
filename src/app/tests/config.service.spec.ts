import { Test, TestingModule } from "@nestjs/testing";
import { AppConfigService } from "../src/config/services/config.service";

describe("AppConfigService", () => {

  const mockValues: Record<string, any> = {
    NODE_ENV: "production",
    DATABASE_NAME: "mydb",
    DATABASE_HOST: "db-host",
    DATABASE_PORT: 5433,
    DATABASE_USERNAME: "dbuser",
    DATABASE_PASSWORD: "secretpw",
    FRONTEND_URL: "https://frontend.example.com",
    PORT: 8080,
    JWT_SECRET: "supersecret",
  };

  const mockConfig = {
    get: jest.fn(
      (key: string, defaultVal?: any) => mockValues[key] ?? defaultVal,
    ),
  };
  const emptyMock = { get: jest.fn() };
  let configService: AppConfigService = new AppConfigService(mockConfig as any);

  it("returns env variable from config", () => {
    expect(configService.env).toBe("production");
  });

  it("falls back to development when NODE_ENV not set", () => {
    const instance = new AppConfigService(emptyMock as any);
    expect(instance.env).toBe("development");
  });

  it("returns database config object", () => {
    const db = configService.database;
    expect(db).toEqual({
      name: "mydb",
      host: "db-host",
      port: 5433,
      username: "dbuser",
      password: "secretpw",
    });
  });

  it("returns default database config object", () => {
    const instance = new AppConfigService(emptyMock as any);
    const db = instance.database;
    expect(db).toEqual({
      name: "url_shortener",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "password",
    });
  });

  it("returns frontendUrl", () => {
    expect(configService.frontendUrl).toBe("https://frontend.example.com");
  });

  it("returns default frontendUrl", () => {
    const instance = new AppConfigService(emptyMock as any);
    expect(instance.frontendUrl).toBe("http://localhost:6000");
  });

  it("returns port from config", () => {
    expect(configService.port).toBe(8080);
  });

  it("falls back to 6000 when PORT not set", () => {
    const instance = new AppConfigService(emptyMock as any);
    expect(instance.port).toBe(6000);
  });

  it("returns jwtSecret", () => {
    expect(configService.jwtSecret).toBe("supersecret");
  });

  it("falls back to 'secret_key' when JWT_SECRET not set", () => {
    const instance = new AppConfigService(emptyMock as any);
    expect(instance.jwtSecret).toBe("secret_key");
  });
});
