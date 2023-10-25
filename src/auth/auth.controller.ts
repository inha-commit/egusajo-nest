import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninResponseDto } from './dto/signin.response.dto';
import { SigninRequestDto } from './dto/signin.request.dto';
import { SignupResponseDto } from './dto/signup.response.dto';
import { SignupRequestDto } from './dto/signup.request.dto';
import { NicknameValidationResponseDto } from './dto/nicknameValidation.response.dto';
import { NicknameValidationRequestDto } from './dto/nicknameValidation.request.dto';
import { RefreshTokenGuard } from '../guard/refresh.token.guard';
import { RefreshResponseDto } from './dto/refresh.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: 'SigninResponseDto | SigninResponseDto',
  })
  @ApiOkResponse({
    type: SigninResponseDto,
  })
  @ApiResponse({
    status: 1002,
    description: '존재하지 않는 유저',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '존재하지 않는 유저입니다!',
          code: 1002,
        },
      },
    },
  })
  @Post('sign-in')
  async login(@Body() data: SigninRequestDto) {
    const response = await this.authService.signIn(data.snsId);

    return new SigninResponseDto(response);
  }

  @ApiOperation({
    summary: '회원가입',
    description: 'SignupRequestDto | SignupResponseDto',
  })
  @ApiOkResponse({
    type: SignupResponseDto,
  })
  @ApiResponse({
    status: 1001,
    description: '이미 회원가입 된 유저',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '이미 가입된 유저입니다!',
          code: 1001,
        },
      },
    },
  })
  @ApiResponse({
    status: 1101,
    description: '이미 사용중인 닉네임인 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '이미 사용중인 닉네임 입니다!',
          code: 1101,
        },
      },
    },
  })
  @Post('sign-up')
  async signUp(@Body() data: SignupRequestDto) {
    const response = await this.authService.signUp(
      data.snsId,
      data.nickname,
      data.birthday,
      data.fcmId,
      data.profileImageSrc,
    );

    return new SignupResponseDto(response);
  }

  @ApiOperation({
    summary: '닉네임 중복체크',
    description: 'NicknameValidationRequestDto | NicknameValidationResponseDto',
  })
  @ApiOkResponse({
    type: NicknameValidationResponseDto,
  })
  @ApiResponse({
    status: 1100,
    description: '닉네임에 욕설이나 비속어가 포함된 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '사용할 수 없는 단어가 포함되어 있습니다!',
          code: 1100,
        },
      },
    },
  })
  @ApiResponse({
    status: 1101,
    description: '이미 사용중인 닉네임인 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '이미 사용중인 닉네임 입니다!',
          code: 1101,
        },
      },
    },
  })
  @Post('nickname-validation')
  async validateNickname(@Body() data: NicknameValidationRequestDto) {
    const response = await this.authService.validateNickname(data.nickname);

    return new NicknameValidationResponseDto(response);
  }

  @ApiOperation({
    summary: '토큰 refresh',
  })
  @ApiHeader({
    name: 'refresh_token',
    description: '발급된 refresh token',
  })
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 2100,
    description: '헤더에 refresh_token이 들어가 있지 않은 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '헤더에 refresh_token이 존재하지 않습니다!',
          code: 2100,
        },
      },
    },
  })
  @ApiResponse({
    status: 2101,
    description: '만료된 refresh_token',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '만료된 refresh_token 입니다!',
          code: 2101,
        },
      },
    },
  })
  @ApiResponse({
    status: 2102,
    description: '잘못된 refresh_token',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '잘못된 refresh_token 입니다!',
          code: 2102,
        },
      },
    },
  })
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() request) {
    const response = await this.authService.refreshToken(request.userId);

    return new RefreshResponseDto(response);
  }
}
