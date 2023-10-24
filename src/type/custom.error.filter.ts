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
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      const errors = exception.getResponse() as {
        message: string;
        code: number;
      };

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
      response.status(500).json({
        statusCode: 500,
        message: 'UNCATCHED ERROR',
        description: exception,
        code: customErrorCode.UNCATCHED_ERROR,
      });
    }
  }
}
