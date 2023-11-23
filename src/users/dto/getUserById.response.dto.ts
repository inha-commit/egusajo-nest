import { ApiProperty } from '@nestjs/swagger';

export class GetUserByIdResponseDto {
  @ApiProperty({
    name: 'id',
    description: '사용자 id',
  })
  public id: number;

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
    name: 'isFollowing',
    description: '내가 팔로우 하고 있는지 여부',
  })
  public isFollowing?: boolean;

  @ApiProperty({
    name: 'presentNum',
    description: '지금까지 펀딩한 횟수',
  })
  public fundingNum?: number;

  @ApiProperty({
    name: 'fundNum',
    description: '지금까지 펀딩받은 횟수',
  })
  public fundedNum?: number;

  constructor(obj: GetUserByIdResponseDto) {
    this.id = obj.id;
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.birthday = obj.birthday;
    this.profileImgSrc = obj.profileImgSrc;
    this.isFollowing = obj.isFollowing;
    this.fundingNum = obj.fundingNum;
    this.fundedNum = obj.fundedNum;
  }
}
