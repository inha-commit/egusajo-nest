import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // throw new HttpException(
    //   {
    //     message: 'Custom Error Message', // 원하는 오류 메시지
    //     code: 1000, // 사용자 정의 코드 추가
    //   },
    //   HttpStatus.BAD_REQUEST,
    // );
    return 'Hello World!';
  }
}
