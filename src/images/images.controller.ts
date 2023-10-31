import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import customErrorCode from '../type/custom.error.code';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @ApiOperation({
    summary: '이미지 저장하기',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    description:
      '프로필이미지라면 users 선물이미지라면 presents라고 보내주세요',
    required: true,
  })
  @ApiOkResponse({
    type: [String],
    description: '사진 배열들',
  })
  @ApiResponse({
    status: 7001,
    description: 'query가 users나 presents 둘 중 하나가 아닌경우',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'BAD REQUEST ERROR',
          description: '잘못된 쿼리 형식입니다!',
          code: 7001,
        },
      },
    },
  })
  @Post('/')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadUserImages(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Query('type') type: string,
  ) {
    if (type !== 'users' && type !== 'presents' && !type) {
      throw new BadRequestException({
        message: 'Query형식이 잘못되었습니다.',
        code: customErrorCode.INVALID_QUERY,
      });
    }

    return await this.imagesService.uploadImages(files, type);
  }
}
