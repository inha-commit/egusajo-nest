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
import {
  DeleteMyInfoResponse,
  FollowResponse,
  UnFollowResponse,
  User,
} from '../type/type';

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

    user.deletedAt = new Date();
    await this.userRepository.save(user);

    return { success: true };
  }

  /**
   * 팔로우 하기
   * @param userId
   * @param nickname
   */
  async follow(userId: number, nickname: string): Promise<FollowResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      relations: ['Followings'],
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // 팔로우 할 사람
    const following = await this.userRepository.findOne({
      where: { nickname: nickname, deletedAt: null },
    });

    if (!following) {
      throw new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    // 이미 팔로우하고 있지 않은 경우에만 팔로우 걸기
    if (!user.Followings.some((Following) => Following.id === following.id)) {
      user.Followings.push(following);
      await this.userRepository.save(user);
    }

    return { success: true };
  }

  async getFollowings(userId: number) {}

  /**
   * 팔로우 취소
   * @param userId
   * @param followingId
   */
  async unFollow(
    userId: number,
    followingId: number,
  ): Promise<UnFollowResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      relations: ['Followings'],
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // 언팔로우 할 사람
    const following = await this.userRepository.findOne({
      where: { id: followingId, deletedAt: null },
    });

    if (!following) {
      throw new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    // 팔로우 중인 경우에만 언팔로우를 수행.
    const indexOfFollowing = user.Followings.findIndex(
      (Following) => Following.id === following.id,
    );

    if (indexOfFollowing !== -1) {
      following.Followers.splice(indexOfFollowing, 1);
      await this.userRepository.save(user);
    }

    return { success: true };
  }
}
