import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new InternalServerErrorException('as');
    throw new HttpException('why', HttpStatus.ACCEPTED);
    throw new BadRequestException('why');
    return 'Hello World!';
  }
}
