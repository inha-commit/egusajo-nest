import { setSeederFactory } from 'typeorm-extension';
import { FollowEntity } from '../../entities/follow.entity';

export default setSeederFactory(FollowEntity, (faker) => {
  const follow = new FollowEntity();
  follow.followingId = faker.number.int({ min: 1, max: 100 });
  follow.followerId = faker.number.int({ min: 1, max: 100 });

  return follow;
});
