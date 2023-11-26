import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import { FollowsService } from './follows.service';
import { AccessTokenGuard } from '../../guards/access.token.guard';
import customErrorCode from '../../filters/custom.error.code';

import { FollowRequestDto } from './dto/follow.request.dto';
import { FollowResponseDto } from './dto/follow.response.dto';
import { UnfollowResponseDto } from './dto/unfollow.response.dto';
import { GetFollowersResponseDto } from './dto/getFollowers.response.dto';
import { GetFollowingsResponseDto } from './dto/getFollowings.response.dto';

@ApiTags('follows')
@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @ApiOperation({
    summary: 'nickname으로 유저 팔로우',
    description: 'FollowRequestDto | FollowResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: FollowResponseDto,
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
    status: 3000,
    description: '존재하지 않는 유저를 팔로우 하는경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '존재하지 않은 유저입니다!',
          code: 3000,
        },
      },
    },
  })
  @Post('/')
  @UseGuards(AccessTokenGuard)
  async followByNickname(@Req() request, @Body() data: FollowRequestDto) {
    const response = await this.followsService.followByNickname(
      request.userId,
      data,
    );

    return new FollowResponseDto(response);
  }

  @ApiOperation({
    summary: 'Id로 유저 팔로우',
    description: 'FollowRequestDto | FollowResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: '팔로우 할 유저 id',
    type: Number,
  })
  @ApiOkResponse({
    type: FollowResponseDto,
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
    status: 3000,
    description: '존재하지 않는 유저를 언팔로우 하는경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '존재하지 않은 유저입니다!',
          code: 3000,
        },
      },
    },
  })
  @Post('/:userId')
  @UseGuards(AccessTokenGuard)
  async followById(@Req() request, @Param('userId') userId: string) {
    // string이 형변환 되는 것 방지
    if (!userId || typeof parseInt(userId) !== 'number') {
      throw new BadRequestException({
        message: 'userId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.followsService.followById(
      request.userId,
      parseInt(userId),
    );

    return new FollowResponseDto(response);
  }

  @ApiOperation({
    summary: '내가 팔로우 하는 유저들 목록 가져오기',
    description: 'GetFollowingsResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: GetFollowingsResponseDto,
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
  @UseGuards(AccessTokenGuard)
  @Get('me/followings')
  async getFollowings(@Req() request) {
    const response = await this.followsService.getFollowings(request.userId);

    return new GetFollowingsResponseDto(response);
  }

  @ApiOperation({
    summary: '나를 팔로우 하는 유저들 목록 가져오기',
    description: 'GetFollowersResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: GetFollowersResponseDto,
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
  @Get('me/followers')
  @UseGuards(AccessTokenGuard)
  async getFollowers(@Req() request) {
    const response = await this.followsService.getFollowers(request.userId);

    return new GetFollowersResponseDto(response);
  }

  @ApiOperation({
    summary: 'Id로 유저 언팔로우',
    description: 'UnfollowResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: '팔로우 취소할 유저 id',
    type: Number,
  })
  @ApiOkResponse({
    type: UnfollowResponseDto,
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
    status: 3000,
    description: '존재하지 않는 유저를 언팔로우 하는경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '존재하지 않은 유저입니다!',
          code: 3000,
        },
      },
    },
  })
  @ApiResponse({
    status: 7000,
    description: '잘못된 param 요청',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: 'userId는 number type이어야 합니다!',
          code: 7000,
        },
      },
    },
  })
  @Delete('/:userId')
  @UseGuards(AccessTokenGuard)
  async unfollow(@Req() request, @Param('userId') userId: string) {
    // string이 형변환 되는 것 방지
    if (!userId || typeof parseInt(userId) !== 'number') {
      throw new BadRequestException({
        message: 'userId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.followsService.unFollow(
      request.userId,
      parseInt(userId),
    );

    return new UnfollowResponseDto(response);
  }
}
