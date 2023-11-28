import { Module } from '@nestjs/common';
import { PresentsService } from './presents.service';
import { PresentsController } from './presents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PresentEntity } from '../../entities/present.entity';
import { PresentImageEntity } from '../../entities/presentImage.entity';
import { FundingEntity } from '../../entities/funding.entity';
import { FundsService } from '../funds/funds.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PresentEntity,
      PresentImageEntity,
      FundingEntity,
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [PresentsController],
  providers: [PresentsService, FundsService],
  exports: [PresentsService],
})
export class PresentsModule {}
