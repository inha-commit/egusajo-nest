import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class FollowRequestDto {
  @ApiProperty({
    name: 'nickname',
    description: '팔로우 할 유저 닉네임',
  })
  @IsString({ message: '닉네임 문자열이여야 합니다!' })
  @MaxLength(30, { message: '닉네임은 30자를 넘을 수 없습니다!' })
  public nickname: string;
}
