import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundingResponseDto {
  @ApiProperty({
    name: 'success',
    description: '게시글 생성 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: CreateFundingResponseDto) {
    this.success = obj.success;
  }
}
