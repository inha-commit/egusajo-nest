import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequestDto {
  @ApiProperty({
    description: '카카오 snsId',
  })
  @IsString()
  readonly snsId: string;

  @ApiProperty({
    description: '중복확인 한 닉네임',
  })
  @IsString()
  @MaxLength(30)
  readonly nickname: string;

  @ApiProperty({
    description:
      '생일 (MM-DD 형식으로 보내주세요) 때문에 항상 5글자여야합니다.',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  readonly birthday: string;

  @ApiProperty({
    description:
      '프로필 이미지 저장소 주소를 보내주세요, 프로필 이미지 설정을 하지 않았다면 서버에서 기본이미지로 설정할테니 null로 보내주세요 ',
  })
  @IsString()
  readonly profileImageSrc: string | null;
}
