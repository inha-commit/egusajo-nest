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
  public birthday: string | Date;

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
    if (typeof obj.birthday === 'string') {
      this.birthday = obj.birthday.replace(
        /(\d{4})-(\d{2})-(\d{2})/,
        '$1/$2/$3',
      );
    } else {
      const year = obj.birthday.getFullYear();
      const month = String(obj.birthday.getMonth() + 1).padStart(2, '0');
      const day = String(obj.birthday.getDate()).padStart(2, '0');
      this.birthday = `${year}/${month}/${day}`;
    }

    this.name = obj.name;
    this.nickname = obj.nickname;
    this.profileImgSrc = obj.profileImgSrc;
    this.fcmId = obj.fcmId;
    this.alarm = obj.alarm;
  }
}
