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
  public birthday: string | Date;

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
    this.bank = obj.bank;
    this.account = obj.account;
    this.profileImgSrc = obj.profileImgSrc;
    this.alarm = obj.alarm;
  }
}
