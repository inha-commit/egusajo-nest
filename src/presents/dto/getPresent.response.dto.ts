import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({
    name: 'id',
    description: '선물 게시글 작성자 Id',
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: '선물 작성자 이름',
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
    name: 'nickname',
    description: '선물 이름',
  })
  name: string;

  @ApiProperty({
    name: 'profileImgSrc',
    description: '선물 대표이미지',
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
    example: '2023-09-14',
  })
  deadline: Date;

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

  constructor(obj: Present) {
    this.id = obj.id;
    this.name = obj.name;
    this.productLink = obj.productLink;
    this.complete = obj.complete;
    this.goal = obj.goal;
    this.money = obj.money;
    this.deadline = obj.deadline;
    this.representImage = obj.representImage;
    this.shortComment = obj.shortComment;
    this.longComment = obj.longComment;
  }
}

class Funding {
  @ApiProperty({
    name: 'id',
    description: '펀딩한 Id',
  })
  id: number;

  @ApiProperty({
    name: 'cost',
    description: '펀딩한 금액',
  })
  cost: number;

  @ApiProperty({
    name: 'comment',
    description: '펀딩 한마디',
  })
  comment: string;

  constructor(obj: Funding) {
    this.id = obj.id;
    this.cost = obj.cost;
    this.comment = obj.comment;
  }
}

class Sender {
  @ApiProperty({
    name: 'id',
    description: '펀딩한 유저 Id',
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: '펀딩한 유저 이름',
  })
  name: string;

  @ApiProperty({
    name: 'nickname',
    description: '펀딩한 유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    name: 'profileImgSrc',
    description: '펀딩한 유저 이미지',
  })
  profileImgSrc: string;

  constructor(obj: Sender) {
    this.id = obj.id;
    this.name = obj.name;
    this.nickname = obj.nickname;
    this.profileImgSrc = obj.profileImgSrc;
  }
}

class FundingWithUser {
  @ApiProperty({
    name: 'funding',
    type: Funding,
    description: '펀딩 내용',
  })
  readonly funding: Funding;

  @ApiProperty({
    name: 'user',
    type: Sender,
    description: '펀딩한 유저 정보',
  })
  readonly user: Sender;

  constructor(obj: FundingWithUser) {
    this.funding = new Funding(obj.funding);
    this.user = new Sender(obj.user);
  }
}

export class GetPresentResponseDto {
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

  @ApiProperty({
    name: 'presentImages',
    description: '선물 이미지들',
  })
  readonly presentImages: string[];

  @ApiProperty({
    name: 'fundings',
    type: [FundingWithUser],
    description: '펀딩들',
  })
  readonly fundings: FundingWithUser[];

  constructor(obj: GetPresentResponseDto) {
    this.user = new User(obj.user);
    this.present = new Present(obj.present);
    this.presentImages = obj.presentImages;
    this.fundings = obj.fundings.map((funding) => new FundingWithUser(funding));
  }
}
