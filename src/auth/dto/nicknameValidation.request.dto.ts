import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NicknameValidationRequestDto {
  @ApiProperty({
    description: '중복확인 할 닉네임',
  })
  @IsString()
  readonly nickname: string;
}
