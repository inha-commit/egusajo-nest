import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from '../entities/user.entity';
import { UserImageEntity } from '../entities/userImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserImageEntity])],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
