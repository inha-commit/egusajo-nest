import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PresentEntity } from '../../entities/present.entity';
import { PresentImageEntity } from '../../entities/presentImage.entity';
import { FollowEntity } from '../../entities/follow.entity';
import { FundingEntity } from '../../entities/funding.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const presentRepository = dataSource.getRepository(PresentEntity);
    const presentImageRepository = dataSource.getRepository(PresentImageEntity);
    const fundingRepository = dataSource.getRepository(FundingEntity);
    const followRepository = dataSource.getRepository(FollowEntity);

    const userFactory = factoryManager.get(UserEntity);
    const followFactory = factoryManager.get(FollowEntity);
    const presentFactory = factoryManager.get(PresentEntity);
    const fundingFactory = factoryManager.get(FundingEntity);
    const presentImageFactory = factoryManager.get(PresentImageEntity);

    const users = await userFactory.saveMany(99);

    // 100번 유저에 대해 모든 유저 팔로우하기
    const followings = [];
    await (async () => {
      for (let i = 2; i < 100; i++) {
        const follow = await followFactory.make({
          followingId: i,
          followerId: 1,
        });
        followings.push(follow);
      }
    })();

    await followRepository.save(followings);

    const followers = [];
    await (async () => {
      for (let i = 2; i < 100; i++) {
        const follow = await followFactory.make({
          followingId: 1,
          followerId: i,
        });
        followers.push(follow);
      }
    })();

    await followRepository.save(followers);

    // Present 삽입
    const presents = [];
    await Promise.all(
      users.map(async (user) => {
        const present = await presentFactory.make({
          User: user,
          shortComment: `${user.nickname}의 선물`,
        });

        presents.push(present);
      }),
    );
    await presentRepository.save(presents);

    // presentImages 삽입
    await Promise.all(
      presents.map(async (present) => {
        const presentImages = await Promise.all(
          Array(5)
            .fill(0)
            .map(async () => {
              return presentImageFactory.make({
                Present: present,
              });
            }),
        );

        await presentImageRepository.save(presentImages);
      }),
    );

    // Funding 삽입
    await Promise.all(
      presents.map(async (present) => {
        const Sender = users[Math.floor(Math.random() * users.length)];

        const fundings = await Promise.all(
          Array(20)
            .fill(0)
            .map(async () => {
              return fundingFactory.make({
                Present: present,
                Receiver: present.User,
                Sender: Sender,
              });
            }),
        );

        await fundingRepository.save(fundings);
      }),
    );
  }
}
