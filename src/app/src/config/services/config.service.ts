import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get env(): string {
    return this.config.get<string>("NODE_ENV") ?? "development";
  }

  get database(): {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
  } {
    return {
      name: this.config.get<string>("DATABASE_NAME") ?? "url_shortener",
      host: this.config.get<string>("DATABASE_HOST") ?? "localhost",
      port: this.config.get<number>("DATABASE_PORT") ?? 5432,
      username: this.config.get<string>("DATABASE_USERNAME") ?? "postgres",
      password: this.config.get<string>("DATABASE_PASSWORD") ?? "password",
    };
  }

  get frontendUrl(): string {
    return this.config.get<string>("FRONTEND_URL") ?? "http://localhost:5600";
  }

  get port(): number {
    return parseInt(this.config.get<string>("PORT") ?? "5600");
  }

  get rateLimitCapacity(): number {
    return parseInt(this.config.get<string>("RATE_LIMIT_CAPACITY") ?? "60");
  }

  get rateLimitWindowMs(): number {
    return (
      parseInt(this.config.get<string>("RATE_LIMIT_WINDOW_MS") ?? "60000") ??
      60000
    );
  }

  get jwtSecret(): string {
    return this.config.get<string>("JWT_SECRET") ?? "secret_key";
  }

  get defaultAdminAccount(): string {
    return this.config.get<string>("ADMIN_ACCOUNT") ?? "admin";
  }

  get defaultAdminPassword(): string {
    return (
      this.config.get<string>("ADMIN_password") ??
      "Please change this password immediately"
    );
  }
}
