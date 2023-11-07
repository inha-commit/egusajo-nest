import { setSeederFactory } from 'typeorm-extension';
import { FundingEntity } from '../../entities/funding.entity';

export default setSeederFactory(FundingEntity, (faker) => {
  const funding = new FundingEntity();

  funding.cost = faker.number.int({ max: 1000 }) * 100;
  funding.comment = faker.lorem.sentence();

  return funding;
});
