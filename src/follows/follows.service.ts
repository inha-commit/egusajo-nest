import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Follower, FollowResponse, UnFollowResponse, User } from '../type/type';
import customErrorCode from '../type/custom.error.code';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ModelConverter } from '../type/model.converter';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  /**
   * Id로 팔로우 하기
   * @param userId
   * @param followingId
   */
  async followById(
    userId: number,
    followingId: number,
  ): Promise<FollowResponse> {
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
      where: { id: followingId, deletedAt: null },
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

  /**
   * 닉네임으로 팔로우 하기
   * @param userId
   * @param nickname
   */
  async followByNickname(
    userId: number,
    nickname: string,
  ): Promise<FollowResponse> {
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

  /**
   * 팔로앙 목록 가져오기
   * @param userId
   */
  async getFollowings(userId: number): Promise<User[]> {
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

    return user.Followings.map((Following) => {
      return ModelConverter.user(Following);
    });
  }

  /**
   * 팔로워 목록 가져오기
   * @param userId
   */
  async getFollowers(userId: number): Promise<Follower[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      relations: ['Followers', 'Followings'],
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    const followings = user.Followings;
    const followers = user.Followers;
    const followersWithFlag: Follower[] = [];

    followers.forEach((follower) => {
      const isFollowing = followings.some(
        (following) => following.id === follower.id,
      );

      followersWithFlag.push({
        ...ModelConverter.user(follower),
        isFollowing: isFollowing,
      });
    });

    return followersWithFlag;
  }

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
