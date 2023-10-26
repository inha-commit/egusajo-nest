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
        message: '존재하지 않는 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    return ModelConverter.user(user);
  }

  /**
   * 유저 정보 업데이트
   * @param userId
   * @param nickname
   * @param birthday
   * @param profileImgSrc
   * @param fcmId
   * @param alarm
   */
  async updateMyInfo(
    userId: number,
    nickname: string,
    birthday: string,
    profileImgSrc: string,
    fcmId: string,
    alarm: boolean,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '존재하지 않는 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // profileImage등록 안하면 기본 이미지로 설정
      if (!profileImgSrc) {
        profileImgSrc = 'basic.png';
      }

      // 유저 정보 수정
      user.nickname = nickname;
      user.fcmId = fcmId;
      user.birthday = birthday;
      user.profileImgSrc = profileImgSrc;
      user.alarm = alarm;

      await queryRunner.manager.save(user);

      return ModelConverter.user(user);
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
        message: '존재하지 않는 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user.deletedAt = new Date();
      await queryRunner.manager.save(user);

      return { success: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
