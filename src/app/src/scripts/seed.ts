import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import * as bcrypt from "bcrypt";
import { UsersService } from "../domain/services/users.service";
import { AppConfigService } from "../config/services/config.service";

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error"],
  });
  const usersService = app.get(UsersService);
  const result = await usersService.seed();
  if (result) {
    const config = app.get(AppConfigService);
    const username = config.defaultAdminAccount;
    const password = config.defaultAdminPassword;
    console.log(`Created admin user '${username}' with password '${password}'.`);
  }
  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
