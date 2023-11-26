import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteMyInfoResponseDto {
  @ApiProperty({
    name: 'success',
    description: '회원 탈퇴 성공!',
  })
  @IsString()
  readonly success: boolean;

  constructor(obj: DeleteMyInfoResponseDto) {
    this.success = obj.success;
  }
}
