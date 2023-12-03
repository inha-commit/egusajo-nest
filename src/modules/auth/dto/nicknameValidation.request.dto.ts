import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NicknameValidationRequestDto {
  @ApiProperty({
    description: '중복확인 할 닉네임',
  })
  @IsString({ message: '닉네임은 문자열이여야 합니다!' })
  readonly nickname: string;
}
