import { ApiProperty } from '@nestjs/swagger';

class GetFollowerResponseDto {
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

    this.id = obj.id;
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.profileImgSrc = obj.profileImgSrc;
    this.isFollowing = obj.isFollowing;
  }
}

export class GetFollowersResponseDto {
  @ApiProperty({ type: [GetFollowerResponseDto] })
  public followers: GetFollowerResponseDto[];

  constructor(obj: GetFollowerResponseDto[]) {
    this.followers = obj.map(
      (item) =>
        new GetFollowerResponseDto({
          id: item.id,
          name: item.name,
          nickname: item.nickname,
          birthday: item.birthday,
          profileImgSrc: item.profileImgSrc,
          isFollowing: item.isFollowing,
        }),
    );
  }
}
