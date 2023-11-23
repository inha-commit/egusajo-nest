import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../guard/access.token.guard';

import { GetMyInfoResponseDto } from './dto/getMyInfo.response.dto';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.request.dto';
import { UpdateMyInfoResponseDto } from './dto/updateMyInfo.response.dto';
import { DeleteMyInfoResponseDto } from './dto/deleteMyInfo.response.dto';
import customErrorCode from '../type/custom.error.code';
import { GetUserByIdResponseDto } from './dto/getUserById.response.dto';
import { GetUsersByNicknameResponseDto } from './dto/getUsersByNickname.response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '내 정보 가져오기',
    description: 'GetMyInfoResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: GetMyInfoResponseDto,
  })
  @ApiResponse({
    status: 1002,
    description: '회원가입 되지 않은 유저',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '회원가입 되지 않은 유저입니다!',
          code: 1002,
        },
      },
    },
  })
  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMyInfo(@Req() request) {
    const response = await this.usersService.getMyInfo(request.userId);

    return new GetMyInfoResponseDto(response);
  }

  @ApiOperation({
    summary: 'id로 유저 정보 가져오기',
    description: 'GetUserByIdResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: '팔로우 할 유저 id',
    type: Number,
  })
  @ApiOkResponse({
    type: GetUserByIdResponseDto,
  })
  @Get('id/:id')
  @UseGuards(AccessTokenGuard)
  async getUserById(@Req() request, @Param('id') id: string) {
    // string이 형변환 되는 것 방지
    if (!id || typeof parseInt(id) !== 'number') {
      throw new BadRequestException({
        message: 'id는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.usersService.getUserById(
      request.userId,
      parseInt(id),
    );

    return new GetUserByIdResponseDto(response);
  }

  @ApiOperation({
    summary: 'nickname으로 유저 검색',
    description: 'GetUsersByNicknameResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiParam({
    name: 'nickname',
    description: '검색할 할 유저 nickname',
    type: String,
  })
  @ApiOkResponse({
    type: GetUsersByNicknameResponseDto,
  })
  @Get('nickname/:nickname')
  @UseGuards(AccessTokenGuard)
  async getUsersByNickname(@Param('nickname') nickname: string) {
    if (!nickname || typeof nickname !== 'string') {
      throw new BadRequestException({
        message: 'nickname은 string type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.usersService.getUsersByNickname(nickname);

    return new GetUsersByNicknameResponseDto(response);
  }

  @ApiOperation({
    summary: '유저 정보 수정',
    description: 'UpdateMyInfoRequestDto | UpdateMyInfoResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: UpdateMyInfoResponseDto,
  })
  @ApiResponse({
    status: 1002,
    description: '회원가입 되지 않은 유저',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '회원가입 되지 않은 유저입니다!',
          code: 1002,
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
  @Patch('me')
  @UseGuards(AccessTokenGuard)
  async updateMyInfo(@Req() request, @Body() data: UpdateMyInfoRequestDto) {
    const response = await this.usersService.updateMyInfo(request.userId, data);
    return new UpdateMyInfoResponseDto(response);
  }

  @ApiOperation({
    summary: '회원탈퇴',
    description: 'DeleteMyInfoResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: DeleteMyInfoResponseDto,
  })
  @ApiResponse({
    status: 1002,
    description: '회원가입 되지 않은 유저',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '회원가입 되지 않은 유저입니다!',
          code: 1002,
        },
      },
    },
  })
  @Delete('me')
  @UseGuards(AccessTokenGuard)
  async deleteMyInfo(@Req() request) {
    const response = await this.usersService.deleteMyInfo(request.userId);
    return new DeleteMyInfoResponseDto(response);
  }

  @Patch('me/account')
  @UseGuards(AccessTokenGuard)
  async updateAccount() {
    // const response = await this.usersService.getMyInfo(data.snsId);
    // return new SigninResponseDto(response);
  }
}
