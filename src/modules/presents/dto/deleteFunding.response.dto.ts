import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFundingResponseDto {
  @ApiProperty({
    name: 'success',
    description: '펀딩 생성 성공',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: DeleteFundingResponseDto) {
    this.success = obj.success;
  }
}
