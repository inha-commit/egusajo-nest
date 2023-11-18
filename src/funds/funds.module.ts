import { Module } from '@nestjs/common';
import { FundsController } from './funds.controller';
import { FundsService } from './funds.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import { FundingEntity } from '../entities/funding.entity';

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
  providers: [FundsService, UsersService],
})
export class FundsModule {}
