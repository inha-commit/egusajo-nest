import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequestDto {
  @ApiProperty({
    description: '카카오 snsId',
  })
  @IsString({ message: 'snsId는 문자열이여야 합니다!' })
  readonly snsId: string;

  @ApiProperty({
    description: '사용자 실제 이름',
  })
  @IsString({ message: '이름은 문자열이여야 합니다!' })
  @MaxLength(30, { message: '이름은 30자를 넘을 수 없습니다!' })
  readonly name: string;

  @ApiProperty({
    description: '중복확인 한 닉네임',
  })
  @IsString({ message: '닉네임은 문자열이여야 합니다!' })
  @MaxLength(30, { message: '닉네임은 30자를 넘을 수 없습니다!' })
  readonly nickname: string;

  @ApiProperty({
    description: 'YYYY/MM/DD 형식으로 보내주세요',
    example: '1998/09/14',
  })
  @IsString({ message: '생일 형식은 문자열이여야 합니다!' })
  readonly birthday: string;

  @ApiProperty({
    description: '사용자 은행',
  })
  @IsString({ message: 'bank는 문자열이여야 합니다!' })
  readonly bank: string;

  @ApiProperty({
    description: '사용자 계좌번호',
  })
  @IsString({ message: 'account는 문자열이여야 합니다!' })
  readonly account: string;

  @ApiProperty({
    description: 'fcm 고유 아이디',
  })
  @IsString({ message: 'fcmId는 문자열이여야 합니다!' })
  readonly fcmId: string;

  @ApiProperty({
    description:
      '프로필 이미지 저장소 주소를 보내주세요, 프로필 이미지 설정을 하지 않았다면 서버에서 기본이미지로 설정할테니 null로 보내주세요 ',
  })
  @IsOptional()
  @IsString()
  readonly profileImgSrc: string | null;
}
