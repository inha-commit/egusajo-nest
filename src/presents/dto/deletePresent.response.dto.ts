import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePresentResponseDto {
  @ApiProperty({
    name: 'success',
    description: '게시글 생성 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: DeletePresentResponseDto) {
    this.success = obj.success;
  }
}
