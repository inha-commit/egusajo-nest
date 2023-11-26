import { ApiProperty } from '@nestjs/swagger';

class RefreshResponseDto {
  @ApiProperty({
    name: 'accessToken',
    description: 'accessToken, 시간 10분',
  })
  public accessToken: string;

  constructor(obj: RefreshResponseDto) {
    this.accessToken = obj.accessToken;
  }
}

export { RefreshResponseDto };
