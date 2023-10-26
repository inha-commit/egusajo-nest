import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../guard/access.token.guard';
import customErrorCode from '../type/custom.error.code';

import { GetMyInfoResponseDto } from './dto/getMyInfo.response.dto';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.request.dto';
import { UpdateMyInfoResponseDto } from './dto/updateMyInfo.response.dto';
import { DeleteMyInfoResponseDto } from './dto/deleteMyInfo.response.dto';
import { FollowRequestDto } from './dto/follow.request.dto';
import { FollowResponseDto } from './dto/follow.response.dto';
import { UnfollowResponseDto } from './dto/unfollow.response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '내 정보 가져오기',
    description: 'GetMyInfoResponseDto',
  })
  @ApiHeader({
    name: 'access_token',
    description: '발급된 access token',
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
    summary: '유저 정보 수정',
    description: 'UpdateMyInfoRequestDto | UpdateMyInfoResponseDto',
  })
  @ApiHeader({
    name: 'access_token',
    description: '발급된 access token',
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
    const response = await this.usersService.updateMyInfo(
      request.userId,
      data.nickname,
      data.birthday,
      data.profileImgSrc,
      data.fcmId,
      data.alarm,
    );
    return new UpdateMyInfoResponseDto(response);
  }

  @ApiOperation({
    summary: '회원탈퇴',
    description: 'DeleteMyInfoResponseDto',
  })
  @ApiHeader({
    name: 'access_token',
    description: '발급된 access token',
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

  @Post('follow')
  @UseGuards(AccessTokenGuard)
  async follow(@Req() request, @Body() data: FollowRequestDto) {
    const response = await this.usersService.follow(
      request.userId,
      data.nickname,
    );

    return new FollowResponseDto(response);
  }

  @Get('follow')
  @UseGuards(AccessTokenGuard)
  async getFollow() {
    // const response = await this.usersService.getMyInfo(data.snsId);
    // return new SigninResponseDto(response);
  }

  @Get('follower')
  @UseGuards(AccessTokenGuard)
  async getFollower(@Req() request) {}

  @Delete('follow')
  @UseGuards(AccessTokenGuard)
  async unfollow(@Req() request, @Param('userId') userId: number) {
    // string이 형변환 되는 것 방지
    if (typeof userId !== 'number') {
      throw new BadRequestException({
        message: 'userId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.usersService.unFollow(request.userId, userId);

    return new UnfollowResponseDto(response);
  }

  @Patch('fcm')
  @UseGuards(AccessTokenGuard)
  async updateFcmToken() {
    // const response = await this.usersService.getMyInfo(data.snsId);
    // return new SigninResponseDto(response);
  }
}
