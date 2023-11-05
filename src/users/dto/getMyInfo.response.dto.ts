import { ApiProperty } from '@nestjs/swagger';

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
    this.profileImgSrc = obj.profileImgSrc;
    this.fcmId = obj.fcmId;
    this.alarm = obj.alarm;
  }
}
