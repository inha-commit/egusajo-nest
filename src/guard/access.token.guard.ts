import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import customErrorCode from '../type/custom.error.code';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.access_token;

    if (!token) {
      throw new BadRequestException({
        message: 'No accessToken in header',
        code: customErrorCode.NO_ACCESS_TOKEN,
      });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded.userId) {
        throw new BadRequestException({
          message: 'Invalid accessToken',
          code: customErrorCode.INVALID_ACCESS_TOKEN,
        });
      }

      request.userId = decoded.userId; // 요청 객체에 사용자 정보 저장
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException({
          message: 'Expired accessToken',
          code: customErrorCode.EXPIRED_ACCESS_TOKEN,
        });
      } else {
        throw new BadRequestException({
          message: 'Invalid accessToken',
          code: customErrorCode.INVALID_ACCESS_TOKEN,
        });
      }
      return false;
    }
  }
}
