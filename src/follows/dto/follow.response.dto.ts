import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowResponseDto {
  @ApiProperty({
    name: 'success',
    description: '팔로우 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: FollowResponseDto) {
    this.success = obj.success;
  }
}
