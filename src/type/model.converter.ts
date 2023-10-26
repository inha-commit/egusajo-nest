import { UserEntity } from '../entities/user.entity';
import { User } from './type';

export class ModelConverter {
  static user(user: UserEntity): User {
    return {
      id: user.id,
      nickname: user.nickname,
      birthday: user.birthday,
      profileImgSrc: user.profileImgSrc,
      fcmId: user.fcmId,
      alarm: user.alarm,
    };
  }
}
