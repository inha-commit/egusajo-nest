import { Module } from '@nestjs/common';
import { FundsController } from './funds.controller';
import { FundsService } from './funds.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import { FundingEntity } from '../entities/funding.entity';
import { JwtService } from '@nestjs/jwt';
import { PresentsService } from '../presents/presents.service';
import { AuthService } from '../auth/auth.service';
import { FcmService } from '../fcm/fcm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PresentEntity,
      PresentImageEntity,
      FundingEntity,
    ]),
  ],
  controllers: [FundsController],
  providers: [
    FundsService,
    AuthService,
    PresentsService,
    UsersService,
    JwtService,
    FcmService,
  ],
})
export class FundsModule {}
