import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PresentsService } from './presents.service';
import customErrorCode from '../../filters/custom.error.code';
import { AccessTokenGuard } from '../../guards/access.token.guard';
import { CreatePresentRequestDto } from './dto/createPresent.request.dto';
import { CreatePresentResponseDto } from './dto/createPresent.response.dto';
import { UpdatePresentResponseDto } from './dto/updatePresent.response.dto';
import { UpdatePresentRequestDto } from './dto/updatePresent.request.dto';
import { DeletePresentResponseDto } from './dto/deletePresent.response.dto';
import { CreateFundingRequestDto } from './dto/createFunding.request.dto';
import { GetPresentResponseDto } from './dto/getPresent.response.dto';
import { CreateFundingResponseDto } from './dto/createFunding.response.dto';
import { GetPresentsResponseDto } from './dto/getPresents.response.dto';
import { FundsService } from '../funds/funds.service';
import { DeleteFundingResponseDto } from './dto/deleteFunding.response.dto';

@ApiTags('presents')
@Controller('presents')
export class PresentsController {
  constructor(
    private presentsService: PresentsService,
    private fundsService: FundsService,
  ) {}

  @ApiOperation({
    summary: '선물 게시물 생성하기',
    description: 'CreatePresentRequestDto | CreatePresentResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
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
    const response = await this.presentsService.createPresentPost(
      request.userId,
      data,
    );

    return new CreatePresentResponseDto(response);
  }

  @ApiOperation({
    summary: '나와 친구들 선물 게시물 가져오기',
    description: 'GetPresentsResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiQuery({ name: 'page', type: Number, description: '페이지' })
  @ApiOkResponse({
    type: GetPresentsResponseDto,
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
  @Get('/')
  async getPresents(@Req() request, @Query() query) {
    if (!query.page || typeof parseInt(query.page) !== 'number') {
      throw new BadRequestException({
        message: 'page는 number type이어야 합니다!',
        code: customErrorCode.INVALID_QUERY,
      });
    }

    const response = await this.presentsService.getPresentPosts(
      request.userId,
      parseInt(query.page),
    );
    return new GetPresentsResponseDto(response);
  }

  @ApiOperation({
    summary: '내 선물 게시물 가져오기',
    description: 'GetPresentResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiQuery({ name: 'page', type: Number, description: '페이지' })
  @ApiOkResponse({
    type: GetPresentsResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getMyPresents(@Req() request, @Query() query) {
    if (!query.page || typeof parseInt(query.page) !== 'number') {
      throw new BadRequestException({
        message: 'page는 number type이어야 합니다!',
        code: customErrorCode.INVALID_QUERY,
      });
    }

    const response = await this.presentsService.getMyPresentPosts(
      request.userId,
      parseInt(query.page),
    );

    return new GetPresentsResponseDto(response);
  }

  @ApiOperation({
    summary: '특정 선물 게시물 가져오기',
    description: 'GetPresentResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiParam({
    name: 'presentId',
    description: '가져올 선물 Id',
    type: Number,
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
  @ApiOkResponse({
    type: GetPresentResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/:presentId')
  async getPresent(@Req() request, @Param('presentId') presentId: string) {
    if (!presentId || typeof parseInt(presentId) !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.presentsService.getPresentPost(
      request.userId,
      parseInt(presentId),
    );

    return new GetPresentResponseDto(response);
  }

  @ApiOperation({
    summary: '특정 선물 게시물 수정하기',
    description: 'UpdatePresentRequestDto | UpdatePresentResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
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
    @Param('presentId') presentId: string,
    @Body() data: UpdatePresentRequestDto,
  ) {
    if (!presentId || typeof parseInt(presentId) !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.presentsService.updatePresentPost(
      request.userId,
      parseInt(presentId),
      data,
    );

    return new UpdatePresentResponseDto(response);
  }

  // @ApiOperation({
  //   summary: '특정 선물 게시물 삭제하기',
  // })
  // @ApiHeader({
  //   name: 'access-token',
  //   description: '발급된 access-token',
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: DeletePresentResponseDto,
  // })
  // @ApiResponse({
  //   status: 1002,
  //   description: '회원가입 되지 않은 유저',
  //   content: {
  //     'application/json': {
  //       example: {
  //         statusCode: 400,
  //         message: 'BAD REQUEST ERROR',
  //         description: '회원가입 되지 않은 유저입니다!',
  //         code: 1002,
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 7000,
  //   description: '절못된 parameter 전송',
  //   content: {
  //     'application/json': {
  //       example: {
  //         statusCode: 400,
  //         message: 'BAD REQUEST ERROR',
  //         description: 'presentId는 number type이어야 합니다!',
  //         code: 7000,
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 4000,
  //   description: '존재하지 않는 게시글에 접근할 때',
  //   content: {
  //     'application/json': {
  //       example: {
  //         statusCode: 400,
  //         message: 'BAD REQUEST ERROR',
  //         description: '존재하지 않는 게시글 입니다!',
  //         code: 4000,
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 4003,
  //   description: '남의 게시물을 삭제하려는 경우',
  //   content: {
  //     'application/json': {
  //       example: {
  //         statusCode: 400,
  //         message: 'BAD REQUEST ERROR',
  //         description: '자신의 게시물만 삭제할 수 있습니다',
  //         code: 4003,
  //       },
  //     },
  //   },
  // })
  // @UseGuards(AccessTokenGuard)
  // @Delete('/:presentId')
  // async deletePresent(@Req() request, @Param('presentId') presentId: string) {
  //   if (!presentId || typeof parseInt(presentId) !== 'number') {
  //     throw new BadRequestException({
  //       message: 'presentId는 number type이어야 합니다!',
  //       code: customErrorCode.INVALID_PARAM,
  //     });
  //   }
  //
  //   const response = await this.presentsService.deletePresent(
  //     request.userId,
  //     parseInt(presentId),
  //   );
  //
  //   return new DeletePresentResponseDto(response);
  // }

  @ApiOperation({
    summary: '선물에 대해 펀딩하기',
    description: 'CreateFundingRequestDto | CreateFundingResponseDto',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiParam({
    name: 'presentId',
    description: '가져올 선물 Id',
    type: Number,
  })
  @ApiOkResponse({
    type: CreateFundingResponseDto,
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
    status: 5001,
    description: '펀딩 금액이 0원인 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '금액은 최소 0원 이상이어야 합니다!',
          code: 5001,
        },
      },
    },
  })
  @ApiResponse({
    status: 5002,
    description: '펀딩 날짜가 지난 펀딩에 대해 펀딩하려는 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '이미 종료된 펀딩입니다!',
          code: 5002,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Post('/:presentId/funds')
  async createFunding(
    @Req() request,
    @Param('presentId') presentId: string,
    @Body() data: CreateFundingRequestDto,
  ) {
    if (!presentId || typeof parseInt(presentId) !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    const response = await this.fundsService.funding(
      parseInt(request.userId),
      parseInt(presentId),
      data,
    );

    return new CreateFundingResponseDto(response);
  }

  @ApiOperation({
    summary: '펀딩 취소하기',
  })
  @ApiHeader({
    name: 'access-token',
    description: '발급된 access-token',
    required: true,
  })
  @ApiOkResponse({
    type: DeleteFundingResponseDto,
  })
  @ApiResponse({
    status: 5003,
    description: '종료된 선물의 펀딩을 삭제하는 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '완료된 펀딩에 대해서는 취소할 수 없습니다!',
          code: 5003,
        },
      },
    },
  })
  @ApiResponse({
    status: 5002,
    description: '자신의 펀딩이 아닌 펀딩을 취소하려 하는 경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '자신의 펀딩만 취소할 수 있습니다.',
          code: 5004,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:presentId/funds/:fundId')
  async deleteFunding(
    @Req() request,
    @Param('presentId') presentId: string,
    @Param('fundId') fundId: string,
  ) {
    if (!presentId || typeof parseInt(presentId) !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    if (!fundId || typeof parseInt(fundId) !== 'number') {
      throw new BadRequestException({
        message: 'presentId는 number type이어야 합니다!',
        code: customErrorCode.INVALID_PARAM,
      });
    }

    await this.fundsService.deleteFunding(
      parseInt(request.userId),
      parseInt(presentId),
      parseInt(fundId),
    );
  }
}
