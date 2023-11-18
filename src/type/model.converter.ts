import { UserEntity } from '../entities/user.entity';
import { Present, PresentImage, User } from './type';
import { FundingEntity } from '../entities/funding.entity';
import { PresentEntity } from '../entities/present.entity';
import { PresentImageEntity } from '../entities/presentImage.entity';

export class ModelConverter {
  static user(user: UserEntity): User {
    return {
      id: user.id,
      snsId: user.snsId,
      name: user.name,
      nickname: user.nickname,
      birthday: user.birthday,
      profileImgSrc: user.profileImgSrc,
      bank: user.bank,
      account: user.account,
      fcmId: user.fcmId,
      alarm: user.alarm,
    };
  }

  static present(present: PresentEntity): Present {
    return {
      id: present.id,
      name: present.name,
      productLink: present.productLink,
      complete: present.complete,
      goal: present.goal,
      money: present.money,
      deadline: present.deadline,
      representImage: present.representImage,
      shortComment: present.shortComment,
      longComment: present.longComment,
      createdAt: present.createdAt,
    };
  }

  static presentImage(presentImage: PresentImageEntity): PresentImage {
    return {
      id: presentImage.id,
      src: presentImage.src,
    };
  }

  static funding(fund: FundingEntity) {
    return {
      id: fund.id,
      cost: fund.cost,
      comment: fund.comment,
      createdAt: fund.createdAt,
    };
  }
}
