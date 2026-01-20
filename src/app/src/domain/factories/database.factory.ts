import { Injectable, Logger } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { AppConfigService } from "../../config/services/config.service";

@Injectable()
export class DatabaseFactory implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseFactory.name);

  constructor(
    private readonly config: AppConfigService
  ) {
    this.logger.log(
      `Configuring database connection...${this.config.database.name}`,
    );
    this.logger.log(`Database user: ${this.config.database.username}`);
    this.logger.log(`Env: ${this.config.env}`);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.config.database.host,
      port: this.config.database.port,
      username: this.config.database.username,
      password: this.config.database.password,
      database: this.config.database.name,
      entities: [__dirname + "/../*/entities/*.entity{.ts,.js}"],
      synchronize: this.config.env !== "production",
      logging: this.config.env === "development",
    };
  }
}
