import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ILike, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import customErrorCode from '../../filters/custom.error.code';
import { ModelConverter } from '../../type/model.converter';
import {
  DeleteMyInfoResponse,
  User,
  CreateUserDAO,
  UpdateUserDAO,
  UpdateMyInfoResponse,
} from '../../type/type';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.request.dto';
import { FollowEntity } from '../../entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
  ) {}

  /**
   * 유저 생성
   * @param createUserDAO
   */
  async createUser(createUserDAO: CreateUserDAO): Promise<User> {
    const { snsId, name, nickname, birthday, bank, account, profileImgSrc } =
      createUserDAO;

    const newUser = new UserEntity();
    newUser.snsId = snsId;
    newUser.name = name;
    newUser.nickname = nickname;
    newUser.bank = bank;
    newUser.account = account;
    newUser.birthday = birthday;
    newUser.alarm = true;

    if (!profileImgSrc) {
      newUser.profileImgSrc = process.env.BASIC_PROFILE_IMAGE_SRC;
    } else {
      newUser.profileImgSrc = profileImgSrc;
    }

    return await this.userRepository.save(newUser);
  }

  /**
   * 유저 조회
   * @param property
   * @param value
   */
  async findUser(
    property: string,
    value: string | number,
    relations: string[] | null,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { [property]: value, deletedAt: null },
      relations: relations,
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    return user;
  }

  /**
   * 회원가입된 유저인지 조회
   * @param property
   * @param value
   */
  async validateUser(
    property: string,
    value: string | number,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { [property]: value, deletedAt: null },
    });
  }

  /**
   * 유저 업데이트
   * @param user
   * @param updateUserDAO
   */
  async updateUser(
    user: UserEntity,
    updateUserDAO: UpdateUserDAO,
  ): Promise<UserEntity> {
    const { name, nickname, birthday, profileImgSrc, alarm } = updateUserDAO;

    user.name = name;
    user.nickname = nickname;
    user.birthday = birthday;
    // user.bank = bank;
    // user.account = account;
    user.alarm = alarm;

    if (!profileImgSrc) {
      user.profileImgSrc = process.env.BASIC_PROFILE_IMAGE_SRC;
    } else {
      user.profileImgSrc = profileImgSrc;
    }

    return await this.userRepository.save(user);
  }

  /**
   * 유저 삭제
   * @param property
   * @param value
   */
  async deleteUser(property: string, value: string | number): Promise<void> {
    await this.userRepository.delete({ [property]: value });
  }

  /**
   * 내 정보 가져오기
   * @param userId
   */
  async getMyInfo(userId: number): Promise<User> {
    const user = await this.findUser('id', userId, null);

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    return ModelConverter.user(user);
  }

  /**
   * id로 유저 가져오기
   * @param userId
   */
  async getUserById(userId: number, id: number): Promise<User> {
    const user = await this.findUser('id', id, ['Funding', 'Funded']);

    // 내가 팔로잉 하고 있는지 여부
    const isFollowing = await this.followRepository.exist({
      where: { followingId: id, followerId: userId },
    });

    // 선물게시물 개수, 펀딩 개수
    const fundingNum = user.Funding.length;
    const fundedNum = user.Funded.length;

    return {
      ...ModelConverter.user(user),
      fundingNum: fundingNum,
      fundedNum: fundedNum,
      isFollowing: isFollowing,
    };
  }

  /**
   * 닉네임으로 유저 검색
   * @param nickname
   */
  async getUsersByNickname(nickname: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        nickname: ILike(`%${nickname}%`),
        deletedAt: null,
      },
    });

    return users.map((user) => {
      return ModelConverter.user(user);
    });
  }

  /**
   * 유저 정보 업데이트
   * @param userId
   * @param data
   */
  async updateMyInfo(
    userId: number,
    data: UpdateMyInfoRequestDto,
  ): Promise<UpdateMyInfoResponse> {
    const { nickname } = data;

    const user = await this.findUser('id', userId, null);

    // validation이 있지만 닉네임 중복 다시 체크
    const nicknameCheck = await this.userRepository.findOne({
      where: { nickname: nickname },
    });

    if (nicknameCheck) {
      throw new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });
    }

    await this.updateUser(user, data);

    return { success: true };
  }

  /**
   * 회원 탈퇴
   * @param userId
   */
  async deleteMyInfo(userId: number): Promise<DeleteMyInfoResponse> {
    await this.findUser('id', userId, null);

    await this.deleteUser('id', userId);

    return { success: true };
  }
}
