import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { FundingEntity } from './src/entities/funding.entity';
import { PresentEntity } from './src/entities/present.entity';
import { UserEntity } from './src/entities/user.entity';
import { PresentImageEntity } from './src/entities/presentImage.entity';
import { UserImageEntity } from './src/entities/userImage.entity';

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
  entities: [
    UserEntity,
    PresentEntity,
    FundingEntity,
    PresentImageEntity,
    UserImageEntity,
  ],
  synchronize: true,
});
