import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env'});
import { DataSource } from "typeorm";

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  entities: ["../**/*.entity.js"],
  migrations: ['../config/migration/**/*.ts'],
});
