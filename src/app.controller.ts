import {
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './guards/access.token.guard';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: '토큰 확인',
    description: 'GetFollowingsResponseDto',
  })
  @ApiHeader({
    name: 'access_token',
    description: '발급된 access token',
  })
  @ApiResponse({
    status: 2000,
    description: '헤더에 토큰이 존재하지 않음',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: 'No accessToken in header',
          code: 2000,
        },
      },
    },
  })
  @ApiResponse({
    status: 2001,
    description: '토큰 만료',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'BAD REQUEST ERROR',
          description: 'Expired accessToken',
          code: 2001,
        },
      },
    },
  })
  @ApiResponse({
    status: 2002,
    description: '잘못된 형식의 토큰',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: 'Invalid accessToken',
          code: 2002,
        },
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  @Get('testToken')
  testToken() {
    return 'ok';
  }
}
