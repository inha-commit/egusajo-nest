import { ApiProperty } from '@nestjs/swagger';

class GetFollowerResponseDto {
  @ApiProperty({
    name: 'id',
    description: '사용자 id',
  })
  public id: number;

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

  constructor(obj: GetFollowerResponseDto) {
    this.id = obj.id;
    this.nickname = obj.nickname;
    this.birthday = obj.birthday;
    this.profileImgSrc = obj.profileImgSrc;
    this.isFollowing = obj.isFollowing;
  }
}

export class GetFollowersResponseDto {
  @ApiProperty({ type: [GetFollowerResponseDto] })
  public followers: GetFollowerResponseDto[];

  constructor(obj: GetFollowerResponseDto[]) {
    this.followers = obj.map((item) => ({
      id: item.id,
      nickname: item.nickname,
      birthday: item.birthday,
      profileImgSrc: item.profileImgSrc,
      isFollowing: item.isFollowing,
    }));
  }
}
