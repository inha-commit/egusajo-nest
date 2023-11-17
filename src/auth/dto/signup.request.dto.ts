import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignupRequestDto {
  @ApiProperty({
    description: '카카오 snsId',
  })
  @IsString()
  readonly snsId: string;

  @ApiProperty({
    description: '사용자 실제 이름',
  })
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({
    description: '중복확인 한 닉네임',
  })
  @IsString()
  @MaxLength(30)
  readonly nickname: string;

  @ApiProperty({
    description: 'YYYY/MM/DD 형식으로 보내주세요',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  readonly birthday: Date;

  @ApiProperty({
    description: '사용자 은행',
  })
  @IsString()
  readonly bank: string;

  @ApiProperty({
    description: '사용자 계좌번호',
  })
  @IsString()
  readonly account: string;

  @ApiProperty({
    description: 'fcm 고유 아이디',
  })
  @IsString()
  readonly fcmId: string;

  @ApiProperty({
    description:
      '프로필 이미지 저장소 주소를 보내주세요, 프로필 이미지 설정을 하지 않았다면 서버에서 기본이미지로 설정할테니 null로 보내주세요 ',
  })
  @IsOptional()
  @IsString()
  readonly profileImageSrc: string | null;
}
