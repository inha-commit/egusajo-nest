import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import customErrorCode from '../type/custom.error.code';
import { ModelConverter } from '../type/model.converter';
import {
  DeleteMyInfoResponse,
  User,
  CreateUserDAO,
  UpdateUserDAO,
} from '../type/type';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    const { name, nickname, birthday, bank, account, profileImgSrc, alarm } =
      updateUserDAO;

    user.name = name;
    user.nickname = nickname;
    user.birthday = birthday;
    user.bank = bank;
    user.account = account;
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
   * 유저 정보 업데이트
   * @param userId
   * @param data
   */
  async updateMyInfo(
    userId: number,
    data: UpdateMyInfoRequestDto,
  ): Promise<User> {
    const { nickname } = data;

    const user = await this.findUser('id', userId, null);

    // validation이 있지만 닉네임 중복 다시 체크
    const nicknameCheck = await this.findUser('nickname', nickname, null);

    if (nicknameCheck) {
      throw new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });
    }

    const updatedUser = await this.updateUser(user, data);

    return ModelConverter.user(updatedUser);
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
