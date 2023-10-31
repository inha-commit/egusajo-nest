import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePresentResponseDto {
  @ApiProperty({
    name: 'success',
    description: '게시글 생성 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: UpdatePresentResponseDto) {
    this.success = obj.success;
  }
}
