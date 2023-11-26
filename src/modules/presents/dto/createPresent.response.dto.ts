import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePresentResponseDto {
  @ApiProperty({
    name: 'success',
    description: '게시글 생성 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: CreatePresentResponseDto) {
    this.success = obj.success;
  }
}
