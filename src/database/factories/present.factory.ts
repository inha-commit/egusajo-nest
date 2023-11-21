import { setSeederFactory } from 'typeorm-extension';
import { PresentEntity } from '../../entities/present.entity';

export default setSeederFactory(PresentEntity, (faker) => {
  const present = new PresentEntity();

  const createdAt = faker.date.between({
    from: '2023-01-01T00:00:00.000Z',
    to: '2023-12-30T00:00:00.000Z',
  });

  const deadline = faker.date.between({
    from: createdAt,
    to: '2023-12-30T00:00:00.000Z',
  });

  const goal = faker.number.int({ max: 10000 });
  present.name = faker.commerce.product();
  present.productLink = null;
  present.complete = true;
  present.goal = goal * 100;
  present.money = faker.number.int({ max: goal }) * 100;
  present.deadline = deadline.toString();
  present.representImage = faker.image.url();
  // present.shortComment = '게시글 제목';
  present.longComment = faker.lorem.sentence();
  present.createdAt = createdAt;

  return present;
});
