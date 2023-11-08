import { setSeederFactory } from 'typeorm-extension';
import { FollowEntity } from '../../entities/follow.entity';

export default setSeederFactory(FollowEntity, (faker) => {
  const follow = new FollowEntity();
  return follow;
});
