import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { NicknameValidationResponse, Tokens } from '../type/type';
import { UserEntity } from '../entities/user.entity';
import { UserImageEntity } from '../entities/userImage.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async login(snsId: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({ where: { snsId: snsId } });

    if (!user) {
      throw new BadRequestException('user does not exist');
    }

    return this.createToken(user.id);
  }

  /**
   * 회원가입
   * @param snsId
   * @param nickname
   * @param birthday
   * @param profileImageSrc
   */
  async signUp(
    snsId: string,
    nickname: string,
    birthday: string,
    profileImageSrc: string | null,
  ): Promise<Tokens> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // snsId로 유저 찾기
      const user = await queryRunner.manager
        .getRepository(UserEntity)
        .findOne({ where: { snsId: snsId } });

      if (user) {
        throw new BadRequestException('user already exist');
      }

      // validation이 있지만 다시 체크
      const nicknameCheck = await queryRunner.manager
        .getRepository(UserEntity)
        .findOne({ where: { nickname: nickname } });

      if (nicknameCheck) {
        throw new BadRequestException('nickname2 already exist');
      }

      // 유저 저장
      const newUser = new UserEntity();
      newUser.snsId = snsId;
      newUser.nickname = nickname;
      newUser.birthday = birthday;

      // 유저 이미지 저장
      const userImage = new UserImageEntity();
      await queryRunner.manager.save(newUser);

      // profileImage등록 안하면 기본 이미지로 설정
      if (!profileImageSrc) {
        profileImageSrc = 'basic.png';
      }

      userImage.src = profileImageSrc;
      await queryRunner.manager.save(userImage);
      this.logger.log('new user join');

      return this.createToken(newUser.id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 닉네임 중복 체크
   * @param nickname
   */
  async validateNickname(
    nickname: string,
  ): Promise<NicknameValidationResponse> {
    const user = await this.userRepository.findOne({
      where: { nickname: nickname },
    });

    return { exist: !!user };
  }

  /**
   * userId로 토큰 생성
   * @param userId
   */
  createToken(userId: number): Tokens {
    const accessToken = this.jwtService.sign(
      { userId: `${userId}` },
      {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}`,
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId: `${userId}` },
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE}` },
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
