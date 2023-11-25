import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { FollowEntity } from '../entities/follow.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { FcmService } from '../fcm/fcm.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [FollowsController],
  providers: [
    FollowsService,
    AuthService,
    UsersService,
    JwtService,
    Logger,
    FcmService,
  ],
})
export class FollowsModule {}
