import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfigService,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    SlackModule,
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
  exports: [RedisModule],
})
export class AppModule {}
