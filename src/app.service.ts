import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {}
  getHello(): string {
    //   const tokens = [];
    //   for (let i = 1; i <= 100; i++) {
    //     const token = this.jwtService.sign({ userId: i });
    //     tokens.push(token);
    //   }
    //   return tokens;
    return 'Server working';
  }
}
