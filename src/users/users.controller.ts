import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignupRequestDto } from './dto/signup.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';

import { LoginResponseDto } from './dto/login.response.dto';
import { SignupResponseDto } from './dto/signup.response.dto';
import { NicknameValidationResponseDto } from './dto/nicknameValidation.response.dto';
import { NicknameValidationRequestDto } from './dto/nicknameValidation.request.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '로그인',
    description: 'LoginResponseDto | LoginResponseDto',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    const response = await this.usersService.login(data.snsId);

    return new LoginResponseDto(response);
  }

  @ApiOperation({
    summary: '회원가입',
    description: 'SignupRequestDto | SignupResponseDto',
  })
  @ApiOkResponse({
    type: SignupResponseDto,
  })
  @Post('sign-up')
  async signUp(@Body() data: SignupRequestDto) {
    const response = await this.usersService.signUp(
      data.snsId,
      data.nickname,
      data.birthday,
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
  @Post('nickname-validation')
  async validateNickname(@Body() data: NicknameValidationRequestDto) {
    const response = await this.usersService.validateNickname(data.nickname);

    return new NicknameValidationResponseDto(response);
  }
}
