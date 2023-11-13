import { BadRequestException, Injectable } from '@nestjs/common';
import { Follower, FollowResponse, UnFollowResponse, User } from '../type/type';
import customErrorCode from '../type/custom.error.code';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ModelConverter } from '../type/model.converter';
import { FollowEntity } from '../entities/follow.entity';
import { FollowRequestDto } from './dto/follow.request.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    private usersService: UsersService,
  ) {}

  async createFollow(follower: UserEntity, user: UserEntity): Promise<void> {
    const follow = new FollowEntity();
    follow.following = follower;
    follow.follower = user;

    await this.followRepository.save(follow);
  }

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    await this.followRepository.softDelete({
      followerId: followerId,
      followingId: followingId,
    });
  }

  /**
   * Id로 팔로우 하기
   * @param userId
   * @param followingId
   */
  async followById(
    userId: number,
    followingId: number,
  ): Promise<FollowResponse> {
    const user = await this.usersService.findUser('id', userId);

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // 팔로우 할 사람
    const follower = await this.usersService.findUser('id', followingId);

    if (!follower) {
      throw new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    await this.createFollow(follower, user);

    return { success: true };
  }

  /**
   * 닉네임으로 팔로우 하기
   * @param userId
   * @param data
   */
  async followByNickname(
    userId: number,
    data: FollowRequestDto,
  ): Promise<FollowResponse> {
    const { nickname } = data;

    const user = await this.usersService.findUser('id', userId);

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // 팔로우 할 사람
    const follower = await this.usersService.findUser('nickname', nickname);

    if (!follower) {
      throw new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    await this.createFollow(follower, user);

    return { success: true };
  }

  /**
   * 내가 팔로우 하는 유저들 정보 가져오가
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

    return user.Followings.map((following) => {
      return ModelConverter.user(following);
    });
  }

  /**
   * 나를 팔로우 하는 유저들 정보 가져오기
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
    const user = await this.usersService.findUser('id', userId);

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    // 언팔로우 할 사람
    const follower = await this.usersService.findUser('id', followingId);

    if (!follower) {
      throw new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });
    }

    // TODO: 원래 follow관계가 아니였던 경우는?

    await this.deleteFollow(follower.id, user.id);

    return { success: true };
  }
}
