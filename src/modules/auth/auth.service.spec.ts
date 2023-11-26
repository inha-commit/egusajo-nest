import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import customErrorCode from '../../filters/custom.error.code';
import { JwtService } from '@nestjs/jwt';
import { SigninRequestDto } from './dto/signin.request.dto';
import { SigninResponseDto } from './dto/signin.response.dto';
import { UsersService } from '../users/users.service';
import { SignupRequestDto } from './dto/signup.request.dto';
import { SignupResponseDto } from './dto/signup.response.dto';

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
  ];

  createUser() {
    return this.#data[0];
  }

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

class MockJwtService {
  sign() {
    return 'test_token';
  }
}

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: UsersService,
          useClass: MockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateNickname', () => {
    it('ValidateNickname success', async () => {
      const request = { nickname: 'nickname' };
      const response = { success: true };

      await expect(
        authService.validateNickname(request),
      ).resolves.toStrictEqual(response);
    });

    it('Slang nickname Error', async () => {
      const request = { nickname: '씨발' };
      const response = new BadRequestException({
        message: '사용할 수 없는 단어가 포함되어 있습니다!',
        code: customErrorCode.INVALID_NICKNAME,
      });

      await expect(authService.validateNickname(request)).rejects.toThrow(
        response,
      );
    });

    it('Duplicate nickname Error', async () => {
      const request = { nickname: 'test_nickname' };
      const response = new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });

      await expect(authService.validateNickname(request)).rejects.toThrow(
        response,
      );
    });
  });

  describe('SignIn', () => {
    it('SignIn success', async () => {
      const request: SigninRequestDto = { snsId: 'test_snsId' };
      const response: SigninResponseDto = {
        accessToken: 'test_token',
        refreshToken: 'test_token',
      };

      await expect(authService.signIn(request)).resolves.toStrictEqual(
        response,
      );
    });

    it('UnAuthorized user Error', async () => {
      const request: SigninRequestDto = {
        snsId: 'unAuthorized_snsId',
      };
      const response = new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });

      await expect(authService.signIn(request)).rejects.toThrow(response);
    });
  });

  describe('SignUp', () => {
    it('SignUp success', async () => {
      const request: SignupRequestDto = {
        snsId: 'new_snsId',
        name: 'new_name',
        nickname: 'new_nickname',
        birthday: new Date('1998/09/14'),
        bank: 'new_bank',
        account: 'new_account',
        fcmId: 'new_fcmId',
        profileImgSrc: null,
      };

      const response: SignupResponseDto = {
        accessToken: 'test_token',
        refreshToken: 'test_token',
      };

      await expect(authService.signUp(request)).resolves.toStrictEqual(
        response,
      );
    });

    it('Duplicate snsId Error', async () => {
      const request: SignupRequestDto = {
        snsId: 'test_snsId',
        name: 'new_name',
        nickname: 'new_nickname',
        birthday: new Date('1998/09/14'),
        bank: 'new_bank',
        account: 'new_account',
        fcmId: 'new_fcmId',
        profileImgSrc: null,
      };

      const response = new BadRequestException({
        message: '이미 가입된 유저입니다!',
        code: customErrorCode.USER_ALREADY_EXIST,
      });

      await expect(authService.signUp(request)).rejects.toThrow(response);
    });

    it('Duplicate fcmId Error', async () => {
      const request: SignupRequestDto = {
        snsId: 'new_snsId',
        name: 'new_name',
        nickname: 'new_nickname',
        birthday: new Date('1998/09/14'),
        bank: 'new_bank',
        account: 'new_account',
        fcmId: 'test_fcmId',
        profileImgSrc: null,
      };

      const response = new BadRequestException({
        message: '이미 가입된 유저입니다!',
        code: customErrorCode.USER_ALREADY_EXIST,
      });

      await expect(authService.signUp(request)).rejects.toThrow(response);
    });

    it('Duplicate nickname Error', async () => {
      const request: SignupRequestDto = {
        snsId: 'new_snsId',
        name: 'new_name',
        nickname: 'test_nickname',
        birthday: new Date('1998/09/14'),
        bank: 'new_bank',
        account: 'new_account',
        fcmId: 'new_fcmId',
        profileImgSrc: null,
      };

      const response = new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });

      await expect(authService.signUp(request)).rejects.toThrow(response);
    });
  });

  describe('checkSlang', () => {
    it('slang word', async () => {
      const request = '씨발';
      const response = true;

      expect(authService.checkSlang(request)).toBe(response);
    });

    it('not slang word', async () => {
      const request = '안녕';
      const response = false;

      expect(authService.checkSlang(request)).toBe(response);
    });
  });

  describe('refresh', () => {
    it('refresh success', async () => {
      const request = 1;
      const response = { accessToken: 'test_token' };

      expect(authService.refresh(request)).toStrictEqual(response);
    });
  });

  describe('createAccessToken', () => {
    it('createAccessToken success', async () => {
      const request = 1;
      const response = 'test_token';

      expect(authService.createAccessToken(request)).toBe(response);
    });
  });

  describe('createRefreshToken', () => {
    it('createRefreshToken success', async () => {
      const request = 1;
      const response = 'test_token';

      expect(authService.createRefreshToken(request)).toBe(response);
    });
  });
});
