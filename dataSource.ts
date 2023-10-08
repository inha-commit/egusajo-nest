import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/src/config/env/.${process.env.NODE_ENV}.env`,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
});
