import { ApiProperty } from '@nestjs/swagger';
import { createdAtToString, deadlineToString } from '../../../hooks/date';

class User {
  @ApiProperty({
    name: 'id',
    description: '선물 게시글 작성자 Id',
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: '선물 게시글 작성자 이름',
  })
  name: string;

  @ApiProperty({
    name: 'nickname',
    description: '선물 게시글 작성자 닉네임',
  })
  nickname: string;

  @ApiProperty({
    name: 'profileImgSrc',
    description: '선물 게시글 작성자 이미지',
  })
  profileImgSrc: string;

  constructor(obj: User) {
    this.id = obj.id;
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.profileImgSrc = obj.profileImgSrc;
  }
}

class Present {
  @ApiProperty({
    name: 'id',
    description: '선물 게시글 Id',
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: '선물 이름',
  })
  name: string;

  @ApiProperty({
    name: 'productLink',
    description: '선물 링크',
  })
  productLink: string;

  @ApiProperty({
    name: 'complete',
    description: '펀딩 완료 여부',
  })
  complete: boolean;

  @ApiProperty({
    name: 'goal',
    description: '펀딩 목표 금액',
  })
  goal: number;

  @ApiProperty({
    name: 'money',
    description: '현재까지 펀딩 금액',
  })
  money: number;

  @ApiProperty({
    name: 'deadline',
    description: '펀딩 종료 날짜',
    example: 'D-1',
  })
  deadline: string | Date;

  @ApiProperty({
    name: 'shortComment',
    description: '게시글 제목',
  })
  shortComment: string;

  @ApiProperty({
    name: 'representImage',
    description: '대표 이미지',
  })
  representImage: string;

  @ApiProperty({
    name: 'longComment',
    description: '게시글 내용',
  })
  longComment: string;

  @ApiProperty({
    name: 'createdAt',
    description: '게시물 생성 날짜',
    example: '2023년 11월 23일',
  })
  createdAt: string | Date;

  constructor(obj: Present) {
    this.id = obj.id;
    this.name = obj.name;
    this.productLink = obj.productLink;
    this.complete = obj.complete;
    this.goal = obj.goal;
    this.deadline = deadlineToString(obj.deadline);
    this.money = obj.money;
    this.representImage = obj.representImage;
    this.shortComment = obj.shortComment;
    this.longComment = obj.longComment;
    this.createdAt = createdAtToString(obj.createdAt);
  }
}

class PresentWithUser {
  @ApiProperty({
    name: 'user',
    type: User,
    description: '선물 게시글 작성자 정보',
  })
  readonly user: User;

  @ApiProperty({
    name: 'present',
    type: Present,
    description: '선물 게시글',
  })
  readonly present: Present;

  constructor(obj: PresentWithUser) {
    this.user = new User(obj.user);
    this.present = new Present(obj.present);
  }
}

export class GetPresentsResponseDto {
  @ApiProperty({ type: [PresentWithUser] })
  public presents: PresentWithUser[];

  constructor(obj: PresentWithUser[]) {
    this.presents = obj.map(
      (item) =>
        new PresentWithUser({
          user: item.user,
          present: item.present,
        }),
    );
  }
}
