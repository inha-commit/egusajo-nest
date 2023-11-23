import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { FollowsService } from './follows.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { FollowEntity } from '../entities/follow.entity';
import { BadRequestException } from '@nestjs/common';
import customErrorCode from '../type/custom.error.code';

class MockUserService {
  #data = [
    {
      id: 1,
      snsId: 'test_snsId',
      nickname: 'test_nickname',
      name: '김민우',
      birthday: '19980914',
      bank: 'hana',
      account: '1234-5678',
      profileImgSrc: 'basic.png',
      fcmId: 'test_fcmId',
      alarm: true,
      deletedAt: null,
    },
    {
      id: 2,
      snsId: 'test2_snsId',
      name: 'test2_name',
      nickname: 'test2_nickname',
      birthday: '19980914',
      bank: 'test2_bank',
      account: 'test2_account',
      profileImgSrc: 'basic.png',
      fcmId: 'test2_fcmId',
      alarm: true,
      deletedAt: null,
    },
  ];

  findUser(property: string, value: string | number) {
    const data = this.#data.find(
      (v) => v[property] === value && v.deletedAt === null,
    );

    if (data) {
      return data;
    }
    return null;
  }
}

class MockUserRepository {
  #data = [
    {
      id: 1,
      snsId: 'test_snsId',
      nickname: 'test_nickname',
      name: '김민우',
      birthday: '19980914',
      bank: 'hana',
      account: '1234-5678',
      profileImgSrc: 'basic.png',
      fcmId: 'test_fcmId',
      alarm: true,
      deletedAt: null,
      Followers: [
        {
          id: 2,
          snsId: 'test2_snsId',
          name: 'test2_name',
          nickname: 'test2_nickname',
          birthday: '19980914',
          bank: 'test2_bank',
          account: 'test2_account',
          profileImgSrc: 'basic.png',
          fcmId: 'test2_fcmId',
          alarm: true,
        },
      ],
      Followings: [
        {
          id: 2,
          snsId: 'test2_snsId',
          name: 'test2_name',
          nickname: 'test2_nickname',
          birthday: '19980914',
          bank: 'test2_bank',
          account: 'test2_account',
          profileImgSrc: 'basic.png',
          fcmId: 'test2_fcmId',
          alarm: true,
        },
      ],
    },
  ];

  findOne(parameter) {
    const keys = Object.keys(parameter.where);
    const property = keys[0];
    const value = parameter.where[property];

    const data = this.#data.find(
      (v) => v[property] === value && v.deletedAt === null,
    );

    if (data) {
      return data;
    }
    return null;
  }
}

class MockFollowRepository {
  save() {
    return true;
  }

  softDelete() {
    return true;
  }
}

describe('FollowService', () => {
  let followsService: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(FollowEntity),
          useClass: MockFollowRepository,
        },
        {
          provide: UsersService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    followsService = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(followsService).toBeDefined();
  });

  describe('createFollow', () => {
    it('createFollow success', async () => {
      const user1 = {
        id: 1,
        snsId: 'test_snsId',
        name: 'test_name',
        nickname: 'test_nickname',
        birthday: '1998/09/14',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        alarm: true,
      } as UserEntity;

      const user2 = {
        id: 2,
        snsId: 'test2_snsId',
        name: 'test2_name',
        nickname: 'test2_nickname',
        birthday: '1998/09/14',
        bank: 'test2_bank',
        account: 'test2_account',
        profileImgSrc: 'basic.png',
        alarm: true,
      } as UserEntity;

      await expect(
        followsService.createFollow(user1, user2),
      ).resolves.toBeUndefined();
    });
  });

  describe('deleteFollow', () => {
    it('deleteFollow success', async () => {
      await expect(followsService.deleteFollow(1, 2)).resolves.toBeUndefined();
    });
  });

  describe('followById', () => {
    it('followById success', async () => {
      const response = { success: true };

      await expect(followsService.followById(1, 2)).resolves.toStrictEqual(
        response,
      );
    });

    it('unAuthorized user Error', async () => {
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(followsService.followById(3, 2)).rejects.toThrow(response);
    });

    it('unAuthorized follower Error', async () => {
      const response = new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });

      await expect(followsService.followById(1, 3)).rejects.toThrow(response);
    });
  });

  describe('followByNickname', () => {
    it('followByNickname success', async () => {
      const request = { nickname: 'test2_nickname' };

      const response = { success: true };

      await expect(
        followsService.followByNickname(1, request),
      ).resolves.toStrictEqual(response);
    });

    it('unAuthorized user Error', async () => {
      const request = { nickname: 'test2_nickname' };

      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(followsService.followByNickname(3, request)).rejects.toThrow(
        response,
      );
    });

    it('unAuthorized follower Error', async () => {
      const request = { nickname: 'test3_nickname' };

      const response = new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });

      await expect(followsService.followByNickname(1, request)).rejects.toThrow(
        response,
      );
    });
  });

  describe('getFollowings', () => {
    it('getFollowings success', async () => {
      const response = [
        {
          id: 2,
          snsId: 'test2_snsId',
          name: 'test2_name',
          nickname: 'test2_nickname',
          birthday: '19980914',
          bank: 'test2_bank',
          account: 'test2_account',
          fcmId: 'test2_fcmId',
          profileImgSrc: 'basic.png',
          alarm: true,
        },
      ];

      await expect(followsService.getFollowings(1)).resolves.toStrictEqual(
        response,
      );
    });

    it('unAuthorized user Error', async () => {
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(followsService.getFollowings(3)).rejects.toThrow(response);
    });
  });

  describe('getFollowers', () => {
    it('getFollowers success', async () => {
      const response = [
        {
          id: 2,
          snsId: 'test2_snsId',
          name: 'test2_name',
          nickname: 'test2_nickname',
          birthday: '19980914',
          bank: 'test2_bank',
          account: 'test2_account',
          fcmId: 'test2_fcmId',
          profileImgSrc: 'basic.png',
          alarm: true,
          isFollowing: true,
        },
      ];

      await expect(followsService.getFollowers(1)).resolves.toStrictEqual(
        response,
      );
    });

    it('unAuthorized user Error', async () => {
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(followsService.getFollowers(3)).rejects.toThrow(response);
    });
  });

  describe('unFollow', () => {
    it('unFollow success', async () => {
      const response = { success: true };

      await expect(followsService.unFollow(1, 2)).resolves.toStrictEqual(
        response,
      );
    });

    it('unAuthorized user Error', async () => {
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(followsService.unFollow(3, 2)).rejects.toThrow(response);
    });

    it('unAuthorized follower Error', async () => {
      const response = new BadRequestException({
        message: '존재하지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_FOUND,
      });

      await expect(followsService.unFollow(1, 3)).rejects.toThrow(response);
    });
  });
});
