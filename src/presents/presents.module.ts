import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import { JwtService } from '@nestjs/jwt';
import { FundingEntity } from '../entities/funding.entity';
import { UsersService } from '../users/users.service';
import { FundsService } from '../funds/funds.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PresentEntity,
      PresentImageEntity,
      FundingEntity,
    ]),
  ],
  controllers: [PresentsController],
  providers: [
    PresentsService,
    FundsService,
    AuthService,
    UsersService,
    JwtService,
  ],
})
export class PresentsModule {}
