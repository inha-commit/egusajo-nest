import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import customErrorCode from './custom.error.code';
import { SlackService } from '../slack/slack.service';

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  private slackService: SlackService;

  constructor() {
    this.slackService = new SlackService();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      const errors = exception.getResponse() as {
        message: string | string[];
        code: number;
      };

      // validation error인 경우
      if (Array.isArray(errors.message)) {
        return response.status(status).json({
          statusCode: status,
          message: 'BAD REQUEST ERROR',
          description: errors.message.join(','),
          code: 8000,
        });
      }

      // token expired error만 따로 401 응답
      if (errors.code === 2001) {
        return response.status(401).json({
          statusCode: status,
          message: 'BAD REQUEST ERROR',
          description: errors.message,
          code: errors.code,
        });
      }

      response.status(status).json({
        statusCode: status,
        message: 'BAD REQUEST ERROR',
        description: errors.message,
        code: errors.code,
      });
    } else if (exception instanceof InternalServerErrorException) {
      const status = exception.getStatus();
      const errors = exception.getResponse() as {
        message: string;
        code: number;
      };

      response.status(status).json({
        statusCode: status,
        message: 'SERVER ERROR',
        description: errors.message,
        code: customErrorCode.INTERNAL_SERVER_ERROR,
      });
    } else if (exception instanceof NotFoundException) {
      response.status(404).json({
        statusCode: 404,
        message: 'PAGE NOT FOUND',
        description: '존재하지 않는 페이지 입니다.',
        code: customErrorCode.PAGE_NOT_FOUND,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errors = exception.getResponse() as {
        message: string;
        code: number;
      };

      response.status(status).json({
        statusCode: status,
        message: 'HTTP ERROR',
        description: errors.message,
        code: errors.code,
      });
    } else {
      this.slackService.fatalError(exception.message);

      response.status(500).json({
        statusCode: 500,
        message: 'UNCATCHED ERROR',
        description: exception.message ? exception.message : null,
        code: customErrorCode.UNCATCHED_ERROR,
      });
    }
  }
}
