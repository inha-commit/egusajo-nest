import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { NicknameValidationResponse, Tokens } from '../type/type';
import { UserEntity } from '../entities/user.entity';
import { UserImageEntity } from '../entities/userImage.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}
}
