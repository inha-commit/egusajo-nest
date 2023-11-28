import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormConfigService } from './config/typeorm.config.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FollowsModule } from './modules/follows/follows.module';
import { ImagesModule } from './modules/images/images.module';
import { PresentsModule } from './modules/presents/presents.module';
import { FundsModule } from './modules/funds/funds.module';
import { FcmModule } from './modules/fcm/fcm.module';
import { RedisModule } from './modules/redis/redis.module';
import { SlackModule } from './modules/slack/slack.module';

import { validationSchema } from './config/validationSchema';

import { CustomErrorFilter } from './filters/custom.error.filter';
import { GlobalJwtModule } from './modules/jwt/jwt.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    FollowsModule,
    PresentsModule,
    ImagesModule,
    FundsModule,
    FcmModule,
    RedisModule,
    SlackModule,
    GlobalJwtModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
})
export class AppModule {}
