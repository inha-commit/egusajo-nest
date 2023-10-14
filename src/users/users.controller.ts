import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpRequestDto } from './dto/signUp.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    const response = await this.usersService.login(data.snsId);

    return { data: response };
  }

  @Post('sign-up')
  async signUp(@Body() data: SignUpRequestDto) {
    const response = await this.usersService.signUp(
      data.snsId,
      data.nickname,
      data.birthday,
      data.profileImageSrc,
    );

    return { data: response };
  }

  @Post('nickname-validation')
  async validateNickname(@Body() data: SignUpRequestDto) {
    const response = await this.usersService.validateNickname(data.nickname);

    return { data: response };
  }
}
