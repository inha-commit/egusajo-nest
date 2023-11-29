import { setSeederFactory } from 'typeorm-extension';
import { PresentEntity } from '../../entities/present.entity';

function getRandomDeadline() {
  const year = Math.floor(Math.random() * (2023 - 1900) + 1900); // 1900년부터 2022년까지 무작위 연도 생성
  const month = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0'); // 1부터 12까지 무작위 월 생성
  const day = String(Math.floor(Math.random() * 31 + 1)).padStart(2, '0'); // 1부터 31까지 무작위 일 생성
  return `${year}/${month}/${day}`;
}

export default setSeederFactory(PresentEntity, (faker) => {
  const present = new PresentEntity();

  const createdAt = faker.date.between({
    from: '2023-01-01T00:00:00.000Z',
    to: '2023-12-30T00:00:00.000Z',
  });

  const goal = faker.number.int({ max: 10000 });
  present.name = faker.commerce.product();
  present.productLink = null;
  present.complete = true;
  present.goal = goal * 100;
  present.money = faker.number.int({ max: goal }) * 100;
  present.deadline = getRandomDeadline();
  present.representImage = faker.image.url();
  // present.shortComment = '게시글 제목';
  present.longComment = faker.lorem.sentence();
  present.createdAt = createdAt;

  return present;
});
