import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, NicknameValidationResponse, Tokens } from '../type/type';
import customErrorCode from '../type/custom.error.code';
import { SlackApiClient } from '../utils/slack.api.client';
import { SignupRequestDto } from './dto/signup.request.dto';
import { SigninRequestDto } from './dto/signin.request.dto';
import { NicknameValidationRequestDto } from './dto/nicknameValidation.request.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private slackClient: SlackApiClient;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    this.slackClient = new SlackApiClient();
  }

  /**
   * 로그인
   * @param data
   */
  async signIn(data: SigninRequestDto): Promise<Tokens> {
    const { snsId, fcmId } = data;

    const user = await this.usersService.findUser('snsId', snsId, null);

    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    // TODO: 여기 redis에 user fcmId 저장

    return { accessToken, refreshToken };
  }

  /**
   * 회원가입
   * @param data
   */
  async signUp(data: SignupRequestDto): Promise<Tokens> {
    const { snsId, nickname, fcmId } = data;

    const snsIdExist = await this.usersService.validateUser('snsId', snsId);

    if (snsIdExist) {
      throw new BadRequestException({
        message: '이미 가입된 유저입니다!',
        code: customErrorCode.USER_ALREADY_EXIST,
      });
    }

    const fcmIdExist = await this.usersService.validateUser('fcmId', fcmId);

    if (fcmIdExist) {
      throw new BadRequestException({
        message: '이미 가입된 유저입니다!',
        code: customErrorCode.USER_ALREADY_EXIST,
      });
    }

    const nicknameExist = await this.usersService.validateUser(
      'nickname',
      nickname,
    );

    if (nicknameExist) {
      throw new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });
    }

    const user = await this.usersService.createUser(data);

    await this.slackClient.newUser();

    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  /**
   * 닉네임 중복 체크
   * @param data
   */
  async validateNickname(
    data: NicknameValidationRequestDto,
  ): Promise<NicknameValidationResponse> {
    const { nickname } = data;

    this.checkSlang(nickname);

    const user = await this.usersService.validateUser('nickname', nickname);

    if (user) {
      throw new BadRequestException({
        message: '이미 사용중인 닉네임 입니다!',
        code: customErrorCode.DUPLICATE_NICKNAME,
      });
    }

    return { success: true };
  }

  /**
   * 욕설 체크
   * @param content
   */
  checkSlang(content: string): void {
    const pattern =
      /[시씨슈쓔쉬쉽쒸쓉]([0-9]*|[0-9]+ *)[바발벌빠빡빨뻘파팔펄]|[섊좆좇졷좄좃좉졽썅춍]|ㅅㅣㅂㅏㄹ?|ㅂ[0-9]*ㅅ|[ㅄᄲᇪᄺᄡᄣᄦᇠ]|[ㅅㅆᄴ][0-9]*[ㄲㅅㅆᄴㅂ]|[존좉좇][0-9 ]*나|[자보][0-9]+지|보빨|[봊봋봇봈볻봁봍] *[빨이]|[후훚훐훛훋훗훘훟훝훑][장앙]|후빨|[엠앰]창|애[미비]|애자|[^탐]색기|([샊샛세쉐쉑쉨쉒객갞갟갯갰갴겍겎겏겤곅곆곇곗곘곜걕걖걗걧걨걬] *[끼키퀴])|새 *[키퀴]|[병븅]신|미친[가-닣닥-힣]|[믿밑]힌|[염옘]병|[샊샛샜샠섹섺셋셌셐셱솃솄솈섁섂섓섔섘]기|[섹섺섻쎅쎆쎇쎽쎾쎿섁섂섃썍썎썏][스쓰]|지랄|니[애에]미|갈[0-9]*보[^가-힣]|[뻐뻑뻒뻙뻨][0-9]*[뀨큐킹낑)|꼬추|곧휴|[가-힣]슬아치|자박꼼|[병븅]딱|빨통|[사싸](이코|가지|까시)|육시[랄럴]|육실[알얼할헐]|즐[^가-힣]|찌(질이|랭이)|찐따|찐찌버거|창[녀놈]|[가-힣]{2,}충[^가-힣]|[가-힣]{2,}츙|부녀자|화냥년|환[양향]년|호[구모]|조[선센][징]|조센|[쪼쪽쪾]([발빨]이|[바빠]리)|盧|무현|찌끄[레래]기|(하악){2,}|하[앍앜]|[낭당랑앙항남담람암함][ ]?[가-힣]+[띠찌]|느[금급]마|文在|在寅|(?<=[^\n])[家哥]|속냐|[tT]l[qQ]kf|Wls/;

    if (pattern.test(content)) {
      throw new BadRequestException({
        message: '사용할 수 없는 단어가 포함되어 있습니다!',
        code: customErrorCode.INVALID_NICKNAME,
      });
    }
  }

  /**
   * refreshToken으로 accessToken 재생성
   * @param userId
   */
  refresh(userId: number): AccessToken {
    const accessToken = this.createRefreshToken(userId);

    return { accessToken: accessToken };
  }

  /**
   * accessToken 생성
   * @param userId
   */
  createAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId: `${userId}` },
      {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}`,
      },
    );
  }

  /**
   * refreshToken 생성
   * @param userId
   */
  createRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId: `${userId}` },
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE}` },
    );
  }
}
