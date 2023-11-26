import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { FollowEntity } from '../../entities/follow.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { FcmService } from '../fcm/fcm.service';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';
import { SlackService } from '../slack/slack.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity]), RedisModule],
  controllers: [FollowsController],
  providers: [
    FollowsService,
    AuthService,
    UsersService,
    JwtService,
    FcmService,
    RedisService,
    SlackService,
  ],
})
export class FollowsModule {}
