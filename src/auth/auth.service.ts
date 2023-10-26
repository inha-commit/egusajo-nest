import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, NicknameValidationResponse, Tokens } from '../type/type';
import customErrorCode from '../type/custom.error.code';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  /**
   * 로그인
   * @param snsId
   */
  async signIn(snsId: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { snsId: snsId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException({
        message: '회원가입 되지 않은 유저입니다!',
        code: customErrorCode.USER_NOT_AUTHENTICATED,
      });
    }

    return this.createToken(user.id);
  }

  /**
   * 회원가입
   * @param snsId
   * @param nickname
   * @param birthday
   * @param fcmId
   * @param profileImageSrc
   */
  async signUp(
    snsId: string,
    nickname: string,
    birthday: string,
    fcmId: string,
    profileImageSrc: string | null,
  ): Promise<Tokens> {
    // snsId로 유저 식별
    const snsIdExist = await this.userRepository.findOne({
      where: { snsId: snsId, deletedAt: null },
    });

    if (snsIdExist) {
      throw new BadRequestException({
        message: '이미 가입된 유저입니다!',
        code: customErrorCode.USER_ALREADY_EXIST,
      });
    }

    // fcmId로 유저 다시 식별
    const fcmIdExist = await this.userRepository.findOne({
      where: { fcmId: fcmId, deletedAt: null },
    });

    if (fcmIdExist) {
      throw new BadRequestException({
        message: '이미 가입된 유저입니다!',
        code: customErrorCode.USER_ALREADY_EXIST,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // profileImage등록 안하면 기본 이미지로 설정
      if (!profileImageSrc) {
        profileImageSrc = 'basic.png';
      }

      // 유저 저장
      const newUser = new UserEntity();
      newUser.snsId = snsId;
      newUser.nickname = nickname;
      newUser.fcmId = fcmId;
      newUser.birthday = birthday;
      newUser.profileImgSrc = profileImageSrc;
      newUser.alarm = true;

      await queryRunner.manager.save(newUser);

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
    if (this.checkSlang(nickname)) {
      throw new BadRequestException({
        message: '사용할 수 없는 단어가 포함되어 있습니다!',
        code: customErrorCode.INVALID_NICKNAME,
      });
    }

    const user = await this.userRepository.findOne({
      where: { nickname: nickname, deletedAt: null },
    });

    if (user) {
      throw new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });
    }

    return { success: true };
  }

  /**
   * refreshToken으로 accessToken 재생성
   * @param userId
   */
  refreshToken(userId: number): AccessToken {
    const accessToken = this.jwtService.sign(
      { userId: `${userId}` },
      {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}`,
      },
    );

    return { accessToken: accessToken };
  }

  /**
   * 욕설 체크
   * @param content
   */
  checkSlang(content: string): boolean {
    const pattern =
      /[시씨슈쓔쉬쉽쒸쓉]([0-9]*|[0-9]+ *)[바발벌빠빡빨뻘파팔펄]|[섊좆좇졷좄좃좉졽썅춍]|ㅅㅣㅂㅏㄹ?|ㅂ[0-9]*ㅅ|[ㅄᄲᇪᄺᄡᄣᄦᇠ]|[ㅅㅆᄴ][0-9]*[ㄲㅅㅆᄴㅂ]|[존좉좇][0-9 ]*나|[자보][0-9]+지|보빨|[봊봋봇봈볻봁봍] *[빨이]|[후훚훐훛훋훗훘훟훝훑][장앙]|후빨|[엠앰]창|애[미비]|애자|[^탐]색기|([샊샛세쉐쉑쉨쉒객갞갟갯갰갴겍겎겏겤곅곆곇곗곘곜걕걖걗걧걨걬] *[끼키퀴])|새 *[키퀴]|[병븅]신|미친[가-닣닥-힣]|[믿밑]힌|[염옘]병|[샊샛샜샠섹섺셋셌셐셱솃솄솈섁섂섓섔섘]기|[섹섺섻쎅쎆쎇쎽쎾쎿섁섂섃썍썎썏][스쓰]|지랄|니[애에]미|갈[0-9]*보[^가-힣]|[뻐뻑뻒뻙뻨][0-9]*[뀨큐킹낑)|꼬추|곧휴|[가-힣]슬아치|자박꼼|[병븅]딱|빨통|[사싸](이코|가지|까시)|육시[랄럴]|육실[알얼할헐]|즐[^가-힣]|찌(질이|랭이)|찐따|찐찌버거|창[녀놈]|[가-힣]{2,}충[^가-힣]|[가-힣]{2,}츙|부녀자|화냥년|환[양향]년|호[구모]|조[선센][징]|조센|[쪼쪽쪾]([발빨]이|[바빠]리)|盧|무현|찌끄[레래]기|(하악){2,}|하[앍앜]|[낭당랑앙항남담람암함][ ]?[가-힣]+[띠찌]|느[금급]마|文在|在寅|(?<=[^\n])[家哥]|속냐|[tT]l[qQ]kf|Wls/;

    return pattern.test(content);
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
