import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NicknameValidationResponseDto {
  @ApiProperty({
    name: 'exist',
    description:
      'exist가 true이면 해당 닉네임을 사용하는 유저가 존재하는 것 입니다',
  })
  @IsString()
  readonly exist: boolean;

  constructor(obj: NicknameValidationResponseDto) {
    this.exist = obj.exist;
  }
}
