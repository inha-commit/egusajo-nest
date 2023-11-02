import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../entities/user.entity';
import { FundingEntity } from '../entities/funding.entity';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';
import { FollowEntity } from '../entities/follow.entity';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        UserEntity,
        PresentEntity,
        FundingEntity,
        PresentImageEntity,
        FollowEntity,
      ],
      synchronize: false,
      logging: true,
    };
  }
}
