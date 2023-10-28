import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMyInfoRequestDto {
  @ApiProperty({
    name: 'nickname',
    description: '사용자 닉네임',
  })
  @MaxLength(30)
  public nickname: string;

  @ApiProperty({
    name: 'birthday',
    description:
      '생일 (YYYYMMDD 형식으로 보내주세요) 때문에 항상 5글자여야합니다.',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  public birthday: string;

  @ApiProperty({
    name: 'profileImgSsrc',
    description:
      '프로필 이미지 저장소 주소를 보내주세요, 프로필 이미지 설정을 하지 않았다면 서버에서 기본이미지로 설정할테니 null로 보내주세요 ',
  })
  @IsOptional()
  @IsString()
  public profileImgSrc: string | null;

  @ApiProperty({
    name: 'fcmId',
    description: '사용자 fcmId',
  })
  @IsString()
  public fcmId: string;

  @ApiProperty({
    name: 'alarm',
    description: '알람 수신 여부',
  })
  @IsBoolean()
  public alarm: boolean;
}