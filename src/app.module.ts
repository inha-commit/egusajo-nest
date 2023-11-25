import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormConfigService } from './config/typeorm.config.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';
import { ImagesModule } from './images/images.module';
import { PresentsModule } from './presents/presents.module';
import { FundsModule } from './funds/funds.module';
import { FcmModule } from './fcm/fcm.module';
import { RedisModule } from './redis/redis.module';
import { SlackModule } from './slack/slack.module';

import { validationSchema } from './config/validationSchema';

import { CustomErrorFilter } from './filter/custom.error.filter';

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
