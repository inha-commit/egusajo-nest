import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMyInfoRequestDto {
  @ApiProperty({
    name: 'name',
    description: '사용자 이름',
  })
  @MaxLength(30)
  public name: string;

  @ApiProperty({
    name: 'nickname',
    description: '사용자 닉네임',
  })
  @MaxLength(30)
  public nickname: string;

  @ApiProperty({
    name: 'birthday',
    description: 'YYYY/MM/DD 형식으로 보내주세요',
  })
  @IsString()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  public birthday: Date;

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
