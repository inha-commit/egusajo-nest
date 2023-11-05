import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import customErrorCode from '../type/custom.error.code';
import { ModelConverter } from '../type/model.converter';
import { DeleteMyInfoResponse, User } from '../type/type';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  /**
   * 내 정보 가져오기
   * @param userId
   */
  async getMyInfo(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    return ModelConverter.user(user);
  }

  /**
   * 유저 정보 업데이트
   * @param userId
   * @param data
   */
  async updateMyInfo(
    userId: number,
    data: UpdateMyInfoRequestDto,
  ): Promise<User> {
    const { name, nickname, birthday, profileImageSrc, fcmId, alarm } = data;

    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // validation이 있지만 닉네임 중복 다시 체크
    const nicknameCheck = await this.userRepository.findOne({
      where: { nickname: nickname, deletedAt: null },
    });

    if (nicknameCheck) {
      throw new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });
    }

    // 유저 정보 수정
    user.name = name;
    user.nickname = nickname;
    user.fcmId = fcmId;
    user.birthday = birthday;
    user.profileImgSrc =
      profileImageSrc === null ? 'basic.png' : profileImageSrc;
    user.alarm = alarm;

    await this.userRepository.save(user);

    return ModelConverter.user(user);
  }

  /**
   * 회원 탈퇴
   * @param userId
   */
  async deleteMyInfo(userId: number): Promise<DeleteMyInfoResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    await this.userRepository.softDelete({ id: userId });

    return { success: true };
  }
}
