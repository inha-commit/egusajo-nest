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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../guard/access.token.guard';
import { CreatePresentRequestDto } from './dto/createPresent.request.dto';
import { PresentsService } from './presents.service';
import { CreatePresentResponseDto } from './dto/createPresent.response.dto';
import { UpdatePresentResponseDto } from './dto/updatePresent.response.dto';
import { UpdatePresentRequestDto } from './dto/updatePresent.request.dto';
import { DeletePresentResponseDto } from './dto/deletePresent.response.dto';
import customErrorCode from '../type/custom.error.code';

@ApiTags('presents')
@Controller('presents')
export class PresentsController {
  constructor(private presentsService: PresentsService) {}

  @ApiOperation({
    summary: '선물 게시물 생성하기',
    description: 'Dto',
  })
  @ApiHeader({
    name: 'access_token',
    description: '발급된 access token',
  })
  @ApiOkResponse({
    type: CreatePresentResponseDto,
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
    status: 4001,
    description: '목표 금액이 0원보다 낮은 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '목표 금액은 0원보다 높아야 합니다!',
          code: 4001,
        },
      },
    },
  })
  @ApiResponse({
    status: 4002,
    description: '기한이 오늘보다 빠른 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '기한은 오늘보다 늦어야 합니다!',
          code: 4002,
        },
      },
    },
  })
  @ApiResponse({
    status: 4004,
    description: '날짜 형식이 잘못된 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '잘못된 날짜 형식입니다',
          code: 4004,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createPresent(@Req() request, @Body() data: CreatePresentRequestDto) {
    const response = await this.presentsService.createPresent(
      request.userId,
      data.name,
      data.productLink,
      data.goal,
      data.deadline,
      data.presentImages,
      data.representImage,
      data.shortComment,
      data.longComment,
    );

    return new CreatePresentResponseDto(response);
  }

  // @ApiOperation({
  //   summary: '나와 친구들 선물 게시물 가져오기',
  //   description: 'Dto',
  // })
  // @Get('/')
  // async getPresents() {}
  //
  // @ApiOperation({
  //   summary: '특정 유저의 선물 게시물들 가져오기',
  //   description: 'Dto',
  // })
  // @Get('/:pr')
  // async getPresent() {}

  @ApiOperation({
    summary: '특정 선물 게시물 가져오기',
    description: 'Dto',
  })
  @ApiParam({
    name: 'presentId',
    description: '가져올 선물 Id',
    type: Number,
  })
  @Get('/:presentId')
  async getPresent(@Param('presentId') presentId: number) {
    if (!presentId || typeof presentId !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    await this.presentsService.getPresent(presentId);
  }

  @ApiOperation({
    summary: '특정 선물 게시물 수정하기',
    description: 'Dto',
  })
  @ApiParam({
    name: 'presentId',
    description: '가져올 선물 Id',
    type: Number,
  })
  @ApiOkResponse({
    type: UpdatePresentResponseDto,
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
    status: 7000,
    description: '절못된 parameter 전송',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: 'presentId는 number type이어야 합니다!',
          code: 7000,
        },
      },
    },
  })
  @ApiResponse({
    status: 4000,
    description: '존재하지 않는 게시글에 접근할 때',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '존재하지 않는 게시글 입니다!',
          code: 4000,
        },
      },
    },
  })
  @ApiResponse({
    status: 4001,
    description: '목표 금액이 0원보다 낮은 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '목표 금액은 0원보다 높아야 합니다!',
          code: 4001,
        },
      },
    },
  })
  @ApiResponse({
    status: 4002,
    description: '기한이 오늘보다 빠른 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '기한은 오늘보다 늦어야 합니다!',
          code: 4002,
        },
      },
    },
  })
  @ApiResponse({
    status: 4003,
    description: '남의 게시물을 수정하려는 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '자신의 게시물만 수정할 수 있습니다',
          code: 4003,
        },
      },
    },
  })
  @ApiResponse({
    status: 4004,
    description: '날짜 형식이 잘못된 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '잘못된 날짜 형식입니다',
          code: 4004,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:presentId')
  async updatePresent(
    @Req() request,
    @Param('presentId') presentId: number,
    @Body() data: UpdatePresentRequestDto,
  ) {
    if (!presentId || typeof presentId !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.presentsService.updatePresent(
      request.userId,
      presentId,
      data.name,
      data.productLink,
      data.goal,
      data.deadline,
      data.presentImages,
      data.representImage,
      data.shortComment,
      data.longComment,
    );

    return new UpdatePresentResponseDto(response);
  }

  @ApiOperation({
    summary: '특정 선물 게시물 삭제하기',
  })
  @ApiOkResponse({
    type: DeletePresentResponseDto,
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
    status: 7000,
    description: '절못된 parameter 전송',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: 'presentId는 number type이어야 합니다!',
          code: 7000,
        },
      },
    },
  })
  @ApiResponse({
    status: 4000,
    description: '존재하지 않는 게시글에 접근할 때',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '존재하지 않는 게시글 입니다!',
          code: 4000,
        },
      },
    },
  })
  @ApiResponse({
    status: 4003,
    description: '남의 게시물을 삭제하려는 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '자신의 게시물만 삭제할 수 있습니다',
          code: 4003,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:presentId')
  async deletePresent(@Req() request, @Param('presentId') presentId: number) {
    if (!presentId || typeof presentId !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.presentsService.deletePresent(
      request.userId,
      presentId,
    );

    return new DeletePresentResponseDto(response);
  }
}
