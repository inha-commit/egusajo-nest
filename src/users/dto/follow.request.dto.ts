import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class FollowRequestDto {
  @ApiProperty({
    name: 'nickname',
    description: '팔로우 할 유저 닉네임',
  })
  @MaxLength(30)
  public nickname: string;
}
