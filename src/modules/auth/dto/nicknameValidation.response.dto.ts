import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NicknameValidationResponseDto {
  @ApiProperty({
    name: 'success',
    description: 'true일때만 사용가능 합니다',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: NicknameValidationResponseDto) {
    this.success = obj.success;
  }
}
