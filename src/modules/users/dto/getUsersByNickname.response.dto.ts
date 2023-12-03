import { ApiProperty } from '@nestjs/swagger';

class User {
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

  constructor(obj: User) {
    this.id = obj.id;
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.birthday = obj.birthday;
    this.profileImgSrc = obj.profileImgSrc;
  }
}

export class GetUsersByNicknameResponseDto {
  @ApiProperty({ type: [User] })
  public users: User[];

  constructor(obj: User[]) {
    this.users = obj.map((user) => new User(user));
  }
}
