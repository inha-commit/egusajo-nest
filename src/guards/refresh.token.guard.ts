import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import customErrorCode from '../filters/custom.error.code';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['refresh-token'];

    if (!token) {
      throw new BadRequestException({
        message: '헤더에 refresh_token이 존재하지 않습니다!',
        code: customErrorCode.NO_REFRESH_TOKEN,
      });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded.userId) {
        throw new BadRequestException({
          message: '잘못된 refresh_token 입니다!',
          code: customErrorCode.INVALID_REFRESH_TOKEN,
        });
      }

      request.userId = decoded.userId; // 요청 객체에 사용자 정보 저장
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException({
          message: '만료된 refresh_token 입니다!',
          code: customErrorCode.EXPIRED_REFRESH_TOKEN,
        });
      } else {
        throw new BadRequestException({
          message: '잘못된 refresh_token 입니다!',
          code: customErrorCode.INVALID_ACCESS_TOKEN,
        });
      }
      return false;
    }
  }
}
