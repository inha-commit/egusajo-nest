import { ApiProperty } from '@nestjs/swagger';

class SigninResponseDto {
  @ApiProperty({
    name: 'accessToken',
    description: 'accessToken, 시간 10분',
  })
  public accessToken: string;

  @ApiProperty({
    name: 'refreshToken',
    description: 'refreshToken, 시간 7일',
  })
  public refreshToken: string;

  constructor(obj: SigninResponseDto) {
    this.accessToken = obj.accessToken;
    this.refreshToken = obj.refreshToken;
  }
}

export { SigninResponseDto };
