import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { FollowEntity } from '../entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [FollowsController],
  providers: [FollowsService, JwtService, Logger],
})
export class FollowsModule {}
