import { IsString } from 'class-validator';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

export class UnfollowResponseDto {
  @ApiProperty({
    name: 'success',
    description: '팔로우 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: UnfollowResponseDto) {
    this.success = obj.success;
  }
}
