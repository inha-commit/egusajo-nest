import { setSeederFactory } from 'typeorm-extension';
import { FollowEntity } from '../../entities/follow.entity';

export default setSeederFactory(FollowEntity, (faker) => {
  const follow = new FollowEntity();
  follow.followingId = Math.floor(Math.random() * 1000) + 1;
  follow.followerId = Math.floor(Math.random() * 1000) + 1;
  return follow;
});
