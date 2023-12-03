import { ApiProperty } from '@nestjs/swagger';

class GetUserByNicknameResponseDto {
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
  public birthday: string;

  @ApiProperty({
    name: 'profileImgSrc',
    description: '사용자 이미지 주소 url',
  })
  public profileImgSrc: string;

  @ApiProperty({
    name: 'isFollowing',
    description: '내가 팔로우 하고 있는지 여부',
  })
  public isFollowing: boolean;

  constructor(obj: GetUserByNicknameResponseDto) {
    this.id = obj.id;
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.birthday = obj.birthday;
    this.profileImgSrc = obj.profileImgSrc;
    this.isFollowing = obj.isFollowing;
  }
}

export class GetUsersByNicknameResponseDto {
  @ApiProperty({ type: [GetUserByNicknameResponseDto] })
  public users: GetUserByNicknameResponseDto[];

  constructor(obj: GetUserByNicknameResponseDto[]) {
    this.users = obj.map((user) => new GetUserByNicknameResponseDto(user));
  }
}
