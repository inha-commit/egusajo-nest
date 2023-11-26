import { ApiProperty } from '@nestjs/swagger';
import { createdAtToString, deadlineToString } from '../../../hooks/date';

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

class Fund {
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

  @ApiProperty({
    name: 'createdAt',
    description: '게시물 생성 날짜',
    example: '2023년 11월 23일',
  })
  createdAt: string | Date;

  constructor(obj: Fund) {
    this.id = obj.id;
    this.cost = obj.cost;
    this.comment = obj.comment;
    this.createdAt = createdAtToString(obj.createdAt);
  }
}

class Funds {
  @ApiProperty({
    name: 'present',
    type: Present,
    description: '선물 게시글',
  })
  readonly present: Present;

  @ApiProperty({
    name: 'fund',
    type: Fund,
    description: '내가한 펀드 목록',
  })
  readonly fund: Fund;

  constructor(obj: Funds) {
    this.present = new Present(obj.present);
    this.fund = new Fund(obj.fund);
  }
}

export class GetFundingHistoryReponseDto {
  @ApiProperty({ type: [Funds] })
  public funds: Funds[];

  constructor(obj: Funds[]) {
    this.funds = obj.map(
      (item) =>
        new Funds({
          fund: item.fund,
          present: item.present,
        }),
    );
  }
}
