import { Injectable } from '@nestjs/common';
import { Follower, FollowResponse, UnFollowResponse, User } from '../type/type';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ModelConverter } from '../type/model.converter';
import { FollowEntity } from '../entities/follow.entity';
import { FollowRequestDto } from './dto/follow.request.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { FcmApiClient } from '../utils/fcm.api.client';

@Injectable()
export class FollowsService {
  private fcmApiClient: FcmApiClient;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    this.fcmApiClient = new FcmApiClient();
  }

  async createFollow(follower: UserEntity, user: UserEntity): Promise<void> {
    const follow = new FollowEntity();
    follow.following = follower;
    follow.follower = user;

    await this.followRepository.save(follow);
  }

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    await this.followRepository.delete({
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
    const user = await this.usersService.findUser('id', userId, null);

    // 팔로우 할 사람
    const follower = await this.usersService.findUser('id', followingId, null);

    const fcmToken = await this.authService.getFcmToken(follower.id);

    if (fcmToken && follower.alarm) {
      const isFollow = await this.followRepository.findOne({
        where: {
          followingId: user.id,
          followerId: follower.id,
        },
      });

      // 이미 이 사람이 나를 팔로우 하고 있다면 fcm 메세지 다르게
      if (isFollow) {
        this.fcmApiClient.followAcceptMessage(user.nickname, fcmToken);
      } else {
        this.fcmApiClient.newFollowerMessage(user.nickname, fcmToken);
      }
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

    const user = await this.usersService.findUser('id', userId, null);

    // 팔로우 할 사람
    const follower = await this.usersService.findUser(
      'nickname',
      nickname,
      null,
    );

    const fcmToken = await this.authService.getFcmToken(follower.id);

    if (fcmToken && user.alarm) {
      const isFollow = await this.followRepository.findOne({
        where: {
          followingId: user.id,
          followerId: follower.id,
        },
      });

      // 이미 이 사람이 나를 팔로우 하고 있다면 fcm 메세지 다르게
      if (isFollow) {
        this.fcmApiClient.followAcceptMessage(user.nickname, fcmToken);
      } else {
        this.fcmApiClient.newFollowerMessage(user.nickname, fcmToken);
      }
    }

    await this.createFollow(follower, user);

    return { success: true };
  }

  /**
   * 내가 팔로우 하는 유저들 정보 가져오기
   * @param userId
   */
  async getFollowings(userId: number): Promise<User[]> {
    const user = await this.usersService.findUser('id', userId, ['Followings']);

    return user.Followings.map((following) => {
      return ModelConverter.user(following);
    });
  }

  /**
   * 나를 팔로우 하는 유저들 정보 가져오기
   * @param userId
   */
  async getFollowers(userId: number): Promise<Follower[]> {
    const user = await this.usersService.findUser('id', userId, [
      'Followers',
      'Followings',
    ]);

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
    const user = await this.usersService.findUser('id', userId, null);

    // 언팔로우 할 사람
    const follower = await this.usersService.findUser('id', followingId, null);

    await this.deleteFollow(user.id, follower.id);

    return { success: true };
  }
}
