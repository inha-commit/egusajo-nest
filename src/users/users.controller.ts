import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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

import { GetMyInfoResponseDto } from './dto/getMyInfo.response.dto';
import { UpdateMyInfoRequestDto } from './dto/updateMyInfo.request.dto';
import { UpdateMyInfoResponseDto } from './dto/updateMyInfo.response.dto';
import { DeleteMyInfoResponseDto } from './dto/deleteMyInfo.response.dto';

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
