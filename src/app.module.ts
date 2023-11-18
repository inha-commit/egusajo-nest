import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FollowsModule } from './follows/follows.module';
import { ImagesModule } from './images/images.module';
import { PresentsModule } from './presents/presents.module';

import { validationSchema } from './config/validationSchema';
import { TypeormConfigService } from './config/typeorm.config.service';
import { CustomErrorFilter } from './type/custom.error.filter';
import { SlackApiClient } from './utils/slack.api.client';
import { FundsModule } from './funds/funds.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    FollowsModule,
    PresentsModule,
    ImagesModule,
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
    FundsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    SlackApiClient,
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
  exports: [SlackApiClient],
})
export class AppModule {}
