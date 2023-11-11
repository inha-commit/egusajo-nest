import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMyInfoResponseDto {
  @ApiProperty({
    name: 'name',
    description: '사용자 이름',
  })
  public name: string;

  @ApiProperty({
    name: 'nickname',
    description: '사용자 닉네임',
  })
  public nickname: string;

  @ApiProperty({
    name: 'birthday',
    description: '사용자 생일',
  })
  public birthday: string;

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
    description: '사용자 이미지 주소 url',
  })
  public profileImgSrc: string;

  @ApiProperty({
    name: 'fcmId',
    description: '사용자 fcmId',
  })
  public fcmId: string;

  @ApiProperty({
    name: 'alarm',
    description: '알람 수신 여부',
  })
  public alarm: boolean;

  constructor(obj: GetMyInfoResponseDto) {
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.birthday = obj.birthday;
    this.bank = obj.bank;
    this.account = obj.account;
    this.profileImgSrc = obj.profileImgSrc;
    this.fcmId = obj.fcmId;
    this.alarm = obj.alarm;
  }
}
