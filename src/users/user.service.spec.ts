import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../type/type';
import { BadRequestException } from '@nestjs/common';
import customErrorCode from '../type/custom.error.code';
import { SigninRequestDto } from '../auth/dto/signin.request.dto';

class MockUserRepository {
  #data = [
    {
      id: 1,
      snsId: 'test_snsId',
      nickname: 'test_nickname',
      name: '김민우',
      birthday: '19980914',
      bank: 'test_bank',
      account: 'test_account',
      profileImgSrc: 'basic.png',
      fcmId: 'test_fcmId',
      alarm: true,
      deletedAt: null,
    },
  ];

  save() {
    return this.#data[0];
  }

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

  softDelete() {
    return true;
  }
}

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('createUser success', async () => {
      const request = {
        snsId: 'test_snsId',
        name: 'test_name',
        nickname: 'test_nickname',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        fcmId: 'basic.png',
        profileImgSrc: 'basic.png',
      };

      const response = {
        id: 1,
        snsId: 'test_snsId',
        nickname: 'test_nickname',
        name: '김민우',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        fcmId: 'test_fcmId',
        alarm: true,
        deletedAt: null,
      };

      await expect(usersService.createUser(request)).resolves.toStrictEqual(
        response,
      );
    });
  });

  describe('findUser', () => {
    it('findUserById success', async () => {
      const response = {
        id: 1,
        snsId: 'test_snsId',
        nickname: 'test_nickname',
        name: '김민우',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        fcmId: 'test_fcmId',
        alarm: true,
        deletedAt: null,
      };

      await expect(usersService.findUser('id', 1)).resolves.toStrictEqual(
        response,
      );
    });

    it('findUserBySnsId success', async () => {
      const response = {
        id: 1,
        snsId: 'test_snsId',
        nickname: 'test_nickname',
        name: '김민우',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        fcmId: 'test_fcmId',
        alarm: true,
        deletedAt: null,
      };

      await expect(
        usersService.findUser('snsId', 'test_snsId'),
      ).resolves.toStrictEqual(response);
    });

    it('findUserByNickname success', async () => {
      const response = {
        id: 1,
        snsId: 'test_snsId',
        nickname: 'test_nickname',
        name: '김민우',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        fcmId: 'test_fcmId',
        alarm: true,
        deletedAt: null,
      };

      await expect(
        usersService.findUser('nickname', 'test_nickname'),
      ).resolves.toStrictEqual(response);
    });

    it('findUserByFcmId success', async () => {
      const response = {
        id: 1,
        snsId: 'test_snsId',
        nickname: 'test_nickname',
        name: '김민우',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        fcmId: 'test_fcmId',
        alarm: true,
        deletedAt: null,
      };

      await expect(
        usersService.findUser('fcmId', 'test_fcmId'),
      ).resolves.toStrictEqual(response);
    });
  });

  describe('deleteUser', () => {
    it('deleteUserById success', async () => {
      await expect(usersService.deleteUser('id', 1)).resolves.toBeUndefined();
    });

    it('deleteUserBySnsId success', async () => {
      await expect(
        usersService.deleteUser('snsId', 'test_snsId'),
      ).resolves.toBeUndefined();
    });

    it('deleteUserByNickname success', async () => {
      await expect(
        usersService.deleteUser('nickname', 'test_nickname'),
      ).resolves.toBeUndefined();
    });

    it('deleteUserByFcmId success', async () => {
      await expect(
        usersService.deleteUser('fcmId', 'test_fcmId'),
      ).resolves.toBeUndefined();
    });
  });

  describe('getMyInfo', () => {
    it('getMyInfo success', async () => {
      const response: User = {
        id: 1,
        snsId: 'test_snsId',
        nickname: 'test_nickname',
        name: '김민우',
        birthday: '19980914',
        bank: 'test_bank',
        account: 'test_account',
        profileImgSrc: 'basic.png',
        fcmId: 'test_fcmId',
        alarm: true,
      };

      await expect(usersService.getMyInfo(1)).resolves.toStrictEqual(response);
    });

    it('UnAuthorized user Error', async () => {
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(usersService.getMyInfo(2)).rejects.toThrow(response);
    });
  });

  describe('deleteMyInfo', () => {
    it('getMyInfo success', async () => {
      const response = { success: true };

      await expect(usersService.deleteMyInfo(1)).resolves.toStrictEqual(
        response,
      );
    });

    it('UnAuthorized user Error', async () => {
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(usersService.deleteMyInfo(2)).rejects.toThrow(response);
    });
  });
});
