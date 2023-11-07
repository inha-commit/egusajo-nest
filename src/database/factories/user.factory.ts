import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../entities/user.entity';

function getRandomDate() {
  const year = Math.floor(Math.random() * (2023 - 1900) + 1900); // 1900년부터 2022년까지 무작위 연도 생성
  const month = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0'); // 1부터 12까지 무작위 월 생성
  const day = String(Math.floor(Math.random() * 31 + 1)).padStart(2, '0'); // 1부터 31까지 무작위 일 생성
  return `${year}${month}${day}`;
}

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();
  user.snsId = faker.string.uuid();
  user.nickname = faker.internet.userName();
  user.name = faker.person.fullName();
  user.birthday = getRandomDate();
  user.bank = 'Hana';
  user.account = faker.finance.accountNumber();
  user.profileImgSrc = faker.image.avatar();
  user.fcmId = faker.string.uuid();
  user.alarm = true;

  return user;
});
